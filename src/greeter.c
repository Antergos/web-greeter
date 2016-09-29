/*
 * greeter.c
 *
 * Copyright © 2014-2016 Antergos Developers <dev@antergos.com>
 *
 * Includes Code Contributed By:
 * Copyright © 2016 Scott Balneaves <sbalneav@ltsp.org>
 *
 * Based on code from lightdm-webkit-greeter:
 * Copyright © 2010-2015 Robert Ancell <robert.ancell@canonical.com>
 *
 * This file is part of lightdm-webkit2-greeter.
 *
 * lightdm-webkit2-greeter is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * lightdm-webkit2-greeter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of the license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with lightdm-webkit2-greeter; If not, see <http://www.gnu.org/licenses/>.
 *
 */

#include <stdlib.h>
#include <gtk/gtk.h>
#include <gdk/gdkx.h>
#include <glib.h>
#include <glib/gprintf.h>
#include <glib-unix.h>
#include <gtk/gtkx.h>
#include <webkit2/webkit2.h>
#include <JavaScriptCore/JavaScript.h>
#include <glib/gi18n.h>
#include <sys/mman.h>

#include <lightdm.h>

#include <config.h>

#include "gresource/greeter-resources.h"

static GtkWidget *web_view;
static GtkWidget *window;
static WebKitSettings *webkit_settings;
static GdkDisplay *default_display;

/* Screensaver values */
static int timeout, interval, prefer_blanking, allow_exposures;

static gint config_timeout;

static gboolean debug_mode, heartbeat, heartbeat_exit;

static GdkFilterReturn
wm_window_filter(GdkXEvent *gxevent, GdkEvent *event, gpointer data) {
	XEvent *xevent = (XEvent *) gxevent;

	if (xevent->type == MapNotify) {
		GdkDisplay *display = gdk_x11_lookup_xdisplay(xevent->xmap.display);
		GdkWindow *win = gdk_x11_window_foreign_new_for_display(display, xevent->xmap.window);
		GdkWindowTypeHint win_type = gdk_window_get_type_hint(win);

		if (win_type != GDK_WINDOW_TYPE_HINT_COMBO
			&& win_type != GDK_WINDOW_TYPE_HINT_TOOLTIP
			&& win_type != GDK_WINDOW_TYPE_HINT_NOTIFICATION) {

			gdk_window_focus(win, GDK_CURRENT_TIME);
		}

	} else if (xevent->type == UnmapNotify) {
		Window xwin;
		int revert_to = RevertToNone;

		XGetInputFocus(xevent->xunmap.display, &xwin, &revert_to);
		if (revert_to == RevertToNone) {
			gdk_window_lower(gtk_widget_get_window(gtk_widget_get_toplevel(GTK_WIDGET(window))));
		}
	}

	return GDK_FILTER_CONTINUE;
}


static void
initialize_web_extensions_cb(WebKitWebContext *context, gpointer user_data) {

	webkit_web_context_set_web_extensions_directory(context, LIGHTDM_WEBKIT2_GREETER_EXTENSIONS_DIR);

}


static void
create_new_webkit_settings_object(void) {
	webkit_settings = webkit_settings_new_with_settings(
		"enable-developer-extras", TRUE,
		"javascript-can-open-windows-automatically", TRUE,
		"allow-file-access-from-file-urls", TRUE,
		"enable-write-console-messages-to-stdout", TRUE,
		//"allow-universal-access-from-file-urls", TRUE,
		NULL
	);
}


static gboolean
context_menu_cb(WebKitWebView *view,
				WebKitContextMenu *context_menu,
				GdkEvent *event,
				WebKitHitTestResult *hit_test_result,
				gpointer user_data) {

	/* Returning true without creating a custom context menu results in no context
	 * menu being shown. Thus, we are returning the opposite of debug_mode to get
	 * desired result (which is only show menu when debug_mode is enabled.
	 */
	return (! debug_mode);
}


static gboolean
check_theme_heartbeat_cb(void) {
	if (! heartbeat && ! heartbeat_exit) {
			/* Theme heartbeat not received. We assume that an error has occurred
			 * which broke script execution. We will fallback to the simple theme
			 * so the user won't be stuck with a broken login screen.
			 */
			g_warning("[ERROR] :: A problem was detected with the current theme. Falling back to simple theme...");
			webkit_web_view_load_uri(
					WEBKIT_WEB_VIEW(web_view),
					g_strdup_printf("file://%s/simple/index.html", THEME_DIR)
			);
	}

	heartbeat = FALSE;

	return heartbeat;
}


/**
 * Callback for Theme Heartbeat. Themes start the heartbeat by sending a post message
 * via JavaScript. Once started, the heartbeat will schedule a check to ensure that the
 * theme has sent a subsequent heartbeat message. Once started, if a heartbeat message was not
 * received by the time our check runs we assume that there has been an error in the web
 * process and fallback to the simple theme.
 */
static void
theme_heartbeat_cb(void) {
	if (! heartbeat) {
		/* Setup g_timeout callback for theme heartbeat check */
		g_timeout_add_seconds(8, (GSourceFunc) check_theme_heartbeat_cb, NULL);
		heartbeat = TRUE;
		heartbeat_exit = FALSE;
	}
}


/**
 * Heartbeat exit callback.
 *
 * Before starting the user's session, themes should exit the heartbeat
 * to prevent a race condition while the greeter is shutting down.
 */
static void
theme_heartbeat_exit_cb(void) {
	heartbeat_exit = TRUE;
}


/**
 * Lock Hint enabled handler.
 *
 * Makes the greeter behave a bit more like a screensaver if it was launched as
 * a lock-screen by blanking the screen.
 */
static void
lock_hint_enabled_handler(void) {
	Display *display = gdk_x11_display_get_xdisplay(default_display);
	config_timeout = (0 != config_timeout) ? config_timeout : 300;

	XGetScreenSaver(display, &timeout, &interval, &prefer_blanking, &allow_exposures);
	XForceScreenSaver(display, ScreenSaverActive);
	XSetScreenSaver(display, config_timeout, 0, PreferBlanking, DefaultExposures);
}


/**
 * Message received callback.
 *
 * Receives messages from our web extension process and calls appropriate handlers.
 *
 * @param manager   The user content manager instance that was created in #main.
 * @param message   The message sent from web extension process.
 * @param user_data Data that is private to the current user.
 */
static void
message_received_cb(WebKitUserContentManager *manager,
					WebKitJavascriptResult *message,
					gpointer user_data) {

	gchar *message_str;
	JSGlobalContextRef context;
	JSValueRef message_val;
	JSStringRef js_str_val;
	gsize message_str_length;

	context = webkit_javascript_result_get_global_context(message);
	message_val = webkit_javascript_result_get_value(message);

	if (JSValueIsString(context, message_val)) {
		js_str_val = JSValueToStringCopy(context, message_val, NULL);
		message_str_length = JSStringGetMaximumUTF8CStringSize(js_str_val);
		message_str = (gchar *)g_malloc (message_str_length);
		JSStringGetUTF8CString(js_str_val, message_str, message_str_length);
		JSStringRelease(js_str_val);

	} else {
		message_str = "";
		printf("Error running javascript: unexpected return value");
	}

	if (strcmp(message_str, "LockHint") == 0) {
		lock_hint_enabled_handler();
	} else if (strcmp(message_str, "Heartbeat") == 0) {
		theme_heartbeat_cb();
	} else if (strcmp(message_str, "Heartbeat::Exit") == 0) {
		theme_heartbeat_exit_cb();
	}

	g_free(message_str);

}


static void
quit_cb(void) {
	gtk_widget_destroy(GTK_WIDGET(web_view));
	gtk_widget_destroy(GTK_WIDGET(window));
	gtk_main_quit();
}


static gchar *
rtrim_comments(gchar *str) {
	gchar *ptr = NULL;

	ptr = strchr(str, '#');

	if (NULL != ptr) {
		*ptr = '\0';
	}

	return g_strstrip(str);
}


int
main(int argc, char **argv) {
	GdkScreen *screen;
	GdkWindow *root_window;
	GdkRectangle geometry;
	GKeyFile *keyfile;
	gchar *theme;
	GdkRGBA bg_color;
	WebKitUserContentManager *manager;
	WebKitWebContext *context;
	GtkCssProvider *css_provider;
	WebKitCookieManager *cookie_manager;
	GResource *greeter_resources;

	/* Prevent memory from being swapped out, since we see unencrypted passwords. */
	mlockall (MCL_CURRENT | MCL_FUTURE);

	/* Initialize i18n */
	bindtextdomain (GETTEXT_PACKAGE, LOCALE_DIR);
	bind_textdomain_codeset (GETTEXT_PACKAGE, "UTF-8");
	textdomain (GETTEXT_PACKAGE);

	gtk_init(&argc, &argv);
	g_unix_signal_add(SIGTERM, (GSourceFunc) quit_cb, NULL);

	/* Apply greeter settings from config file */
	keyfile = g_key_file_new();

	g_key_file_load_from_file(keyfile,
							  CONFIG_DIR "/lightdm-webkit2-greeter.conf",
							  G_KEY_FILE_NONE, NULL);

	theme = g_key_file_get_string(keyfile, "greeter", "webkit-theme", NULL);
	theme = rtrim_comments(theme);
	config_timeout = g_key_file_get_integer(keyfile, "greeter", "screensaver-timeout", NULL);
	debug_mode = g_key_file_get_boolean(keyfile, "greeter", "debug_mode", NULL);

	/* Setup the main window */
	window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
	screen = gtk_window_get_screen(GTK_WINDOW(window));
	root_window = gdk_get_default_root_window();
	default_display = gdk_display_get_default();

	gtk_window_set_decorated(GTK_WINDOW(window), FALSE);
	gdk_screen_get_monitor_geometry(screen, gdk_screen_get_primary_monitor(screen), &geometry);
	gtk_window_set_default_size(GTK_WINDOW(window), geometry.width, geometry.height);
	gtk_window_move(GTK_WINDOW(window), geometry.x, geometry.y);

	/* There is no window manager, so we need to implement some of its functionality */
	gdk_window_set_events(root_window, gdk_window_get_events(root_window) | GDK_SUBSTRUCTURE_MASK);
	gdk_window_add_filter(root_window, wm_window_filter, NULL);

	/* Set default cursor */
	gdk_window_set_cursor(root_window, gdk_cursor_new_for_display(default_display, GDK_LEFT_PTR));

	/* Setup CSS provider. We use CSS to set the window background to black instead
	 * of default white so the screen doesnt flash during startup.
	 */
	greeter_resources = greeter_resources_get_resource();
	css_provider = gtk_css_provider_new();

	g_resources_register(greeter_resources);
	gtk_css_provider_load_from_resource(css_provider, "/com/antergos/lightdm-webkit2-greeter/css");
	gtk_style_context_add_provider_for_screen(
		screen,
		GTK_STYLE_PROVIDER(css_provider),
		GTK_STYLE_PROVIDER_PRIORITY_APPLICATION
	);

	/* Register and connect handler that will set the web extensions directory
	 * so webkit can find our extension.
	 */
	context = webkit_web_context_get_default();
	g_signal_connect(context,
					 "initialize-web-extensions",
					 G_CALLBACK(initialize_web_extensions_cb), NULL);

	/* Set cookie policy */
	cookie_manager = webkit_web_context_get_cookie_manager(context);
	webkit_cookie_manager_set_accept_policy(cookie_manager, WEBKIT_COOKIE_POLICY_ACCEPT_ALWAYS);

	/* Register and connect handler of any messages we send from our web extension process. */
	manager = webkit_user_content_manager_new();
	g_signal_connect(manager, "script-message-received::GreeterBridge", G_CALLBACK(message_received_cb), NULL);
	webkit_user_content_manager_register_script_message_handler(manager, "GreeterBridge");

	/* Create the web_view */
	web_view = webkit_web_view_new_with_user_content_manager(manager);

	/* Set the web_view's settings. */
	create_new_webkit_settings_object();
	webkit_web_view_set_settings(WEBKIT_WEB_VIEW(web_view), webkit_settings);

	/* The default background color of the web_view is white which causes a flash effect when the greeter starts.
	 * We make it black instead. This only applies when the theme hasn't set the body background via CSS.
	 */
	gdk_rgba_parse(&bg_color, "#000000");
	webkit_web_view_set_background_color(WEBKIT_WEB_VIEW(web_view), gdk_rgba_copy(&bg_color));

	/* Maybe disable the context (right-click) menu. */
	g_signal_connect(web_view, "context-menu", G_CALLBACK(context_menu_cb), NULL);

	/* There's no turning back now, let's go! */
	gtk_container_add(GTK_CONTAINER(window), web_view);
	webkit_web_view_load_uri(WEBKIT_WEB_VIEW(web_view),
							 g_strdup_printf("file://%s/%s/index.html", THEME_DIR, theme));

	gtk_widget_show_all(window);

	gtk_main();

	return 0;
}
