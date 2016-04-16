/*
 * lightdm-webkit2-greeter.c
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
#include <glib-unix.h>
#include <gtk/gtkx.h>
#include <webkit2/webkit2.h>
#include <JavaScriptCore/JavaScript.h>
#include <glib/gi18n.h>
#include <sys/mman.h>

#include <lightdm.h>

#include <config.h>

#include "src/lightdm-webkit2-greeter-css-application.h"

static GtkWidget *web_view;
static GtkWidget *window;
static WebKitSettings *webkit_settings;
static GdkDisplay *default_display;

/* Screensaver values */
static int timeout, interval, prefer_blanking, allow_exposures;
static gint config_timeout;

static gboolean debug_mode;

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
 * @param: manager The WebKitUserContentManager instance that was created in #main.
 * @param: message The message sent from web extension process.
 * @param: user_data Data that is private to the current user.
 */
static void
message_received_cb(WebKitUserContentManager *manager,
					WebKitJavascriptResult *message,
					gpointer user_data) {

	/* TODO:
	 * Abstract this by using JSON for exchanging messages so the handler can
	 * be used for more than one task/event.
	 */
	lock_hint_enabled_handler();

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
	WebKitWebsiteDataManager *data_manager;

	/*
	 * Prevent memory from being swapped out, since we see unencrypted
	 * passwords.
	 */
	mlockall (MCL_CURRENT | MCL_FUTURE);

	/* Initialize i18n */
	setlocale (LC_ALL, "");
	bindtextdomain (GETTEXT_PACKAGE, LOCALE_DIR);
	bind_textdomain_codeset (GETTEXT_PACKAGE, "UTF-8");
	textdomain (GETTEXT_PACKAGE);

	gtk_init(&argc, &argv);
	g_unix_signal_add(SIGTERM, (GSourceFunc) gtk_main_quit, NULL);

	/* Apply greeter settings from config file */
	keyfile = g_key_file_new();

	g_key_file_load_from_file(keyfile,
							  CONFIG_DIR "/lightdm-webkit2-greeter.conf",
							  G_KEY_FILE_NONE, NULL);

	theme = g_key_file_get_string(keyfile, "greeter", "webkit-theme", NULL);
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

	/* Setup CSS provider. We use CSS to set the window background to black instead
	 * of default white so the screen doesnt flash during startup.
	 */
	css_provider = gtk_css_provider_new();
	gtk_css_provider_load_from_data(css_provider,
									lightdm_webkit2_greeter_css_application,
									lightdm_webkit2_greeter_css_application_length, NULL);
	gtk_style_context_add_provider_for_screen(screen,
											  GTK_STYLE_PROVIDER(css_provider),
											  GTK_STYLE_PROVIDER_PRIORITY_APPLICATION);

	/* Create a website data manager object to configure our cache and data dirs */
	data_manager = webkit_website_data_manager_new(
			"base-cache-directory",  g_strconcat(g_get_user_cache_dir(), "/", g_get_prgname(), NULL),
			"base-data-directory", g_strconcat(g_get_user_data_dir(), "/", g_get_prgname(), NULL)
	);

	/* Register and connect handler that will set the web extensions directory
	 * so webkit can find our extension.
	 */
	context = webkit_web_context_new_with_website_data_manager(data_manager);
	g_signal_connect(context,
					 "initialize-web-extensions",
					 G_CALLBACK(initialize_web_extensions_cb), NULL);

	/* Register and connect handler of any messages we send from our web extension process. */
	manager = webkit_user_content_manager_new();
	webkit_user_content_manager_register_script_message_handler(manager, "GreeterBridge");
	g_signal_connect(manager,
					 "script-message-received::GreeterBridge",
					 G_CALLBACK(message_received_cb), NULL);

	/* Create the web_view */
	web_view = webkit_web_view_new_with_user_content_manager(manager);

	/* Set the web_view's settings. */
	create_new_webkit_settings_object();
	webkit_web_view_set_settings(WEBKIT_WEB_VIEW(web_view), webkit_settings);

	/* The default background is white which causes a flash effect when the greeter starts.
	 * We make it black instead. This is for backwards compatibility with Gtk versions that
	 * don't use the new CSS provider.
	 */
	gdk_rgba_parse(&bg_color, "#000000");
	webkit_web_view_set_background_color(WEBKIT_WEB_VIEW(web_view), gdk_rgba_copy(&bg_color));

	/* Disable the context (right-click) menu. */
	g_signal_connect(web_view, "context-menu", G_CALLBACK(context_menu_cb), NULL);

	/* There's no turning back now, let's go! */
	gtk_container_add(GTK_CONTAINER(window), web_view);
	webkit_web_view_load_uri(WEBKIT_WEB_VIEW(web_view),
							 g_strdup_printf("file://%s/%s/index.html", THEME_DIR, theme));

	gtk_widget_show_all(window);
	gdk_window_set_cursor(gtk_widget_get_window (GTK_WIDGET (window)), gdk_cursor_new_for_display(default_display, GDK_LEFT_PTR));

	gtk_main();

	return 0;
}
