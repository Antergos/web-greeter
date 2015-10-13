/*
 * lightdm-webkit2-greeter.c
 *
 * Copyright (C) 2010 Robert Ancell.
 * Author: Robert Ancell <robert.ancell@canonical.com>
 * Webkit2 port: Copyright (C) 2014 Antergos
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version. See http://www.gnu.org/copyleft/gpl.html the full text of the
 * license.
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

#include <lightdm.h>

#include <config.h>

static GtkWidget *web_view;
static GtkWidget *window;
static WebKitSettings *webkit_settings;

/*
static void
timed_login_cb (LightDMGreeter *greeter, const gchar *username, WebKitWebView *view)
{
    gchar *command;

    command = g_strdup_printf ("timed_login('%s')", username); // FIXME: Escape text
    webkit_web_view_run_javascript (view, command, NULL, web_view_javascript_finished, NULL);
    g_free (command);
}*/


static void
sigterm_cb(int signum) {
    exit(0);
}

static GdkFilterReturn
wm_window_filter(GdkXEvent *gxevent, GdkEvent *event, gpointer data) {
    XEvent *xevent = (XEvent *) gxevent;
    if (xevent->type == MapNotify) {
        GdkDisplay *display = gdk_x11_lookup_xdisplay(xevent->xmap.display);
        GdkWindow *win = gdk_x11_window_foreign_new_for_display(display, xevent->xmap.window);
        GdkWindowTypeHint win_type = gdk_window_get_type_hint(win);

        if (win_type != GDK_WINDOW_TYPE_HINT_COMBO &&
            win_type != GDK_WINDOW_TYPE_HINT_TOOLTIP &&
            win_type != GDK_WINDOW_TYPE_HINT_NOTIFICATION)
            /*
            if (win_type == GDK_WINDOW_TYPE_HINT_DESKTOP ||
                win_type == GDK_WINDOW_TYPE_HINT_DIALOG)
            */
            gdk_window_focus(win, GDK_CURRENT_TIME);
    }
    else if (xevent->type == UnmapNotify) {
        Window xwin;
        int revert_to = RevertToNone;

        XGetInputFocus(xevent->xunmap.display, &xwin, &revert_to);
        if (revert_to == RevertToNone)
            gdk_window_lower(gtk_widget_get_window(gtk_widget_get_toplevel(GTK_WIDGET(window))));
    }

    return GDK_FILTER_CONTINUE;
}

int
main(int argc, char **argv) {
    GdkScreen *screen;
    GdkRectangle geometry;
    GKeyFile *keyfile;
    gchar *theme;
    GdkRGBA bg_color;

    WebKitWebContext *context = webkit_web_context_get_default();
    webkit_web_context_set_web_extensions_directory(context, LIGHTDM_WEBKIT2_GREETER_EXTENSIONS_DIR);
    webkit_settings = webkit_settings_new_with_settings("enable-developer-extras", TRUE,
                                                        "enable-fullscreen", TRUE,
                                                        "enable-site-specific-quirks", TRUE,
                                                        "enable-dns-prefetching", TRUE,
                                                        "javascript-can-open-windows-automatically", TRUE,
                                                        "allow-file-access-from-file-urls", TRUE,
                                                        "enable-accelerated-2d-canvas", TRUE,
                                                        "enable-smooth-scrolling", TRUE,
                                                        "enable-webgl", TRUE,
                                                        "enable-write-console-messages-to-stdout", TRUE,

                                                        NULL);

    signal(SIGTERM, sigterm_cb);

    gtk_init(&argc, &argv);

    gdk_window_set_cursor(gdk_get_default_root_window(),
                          gdk_cursor_new_for_display(gdk_display_get_default(), GDK_LEFT_PTR));


    /* settings */
    keyfile = g_key_file_new();
    g_key_file_load_from_file(keyfile, "/etc/lightdm/lightdm-webkit2-greeter.conf", G_KEY_FILE_NONE, NULL);
    theme = g_key_file_get_string(keyfile, "greeter", "webkit-theme", NULL);

    window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    screen = gtk_window_get_screen(GTK_WINDOW(window));

    gtk_window_set_decorated(GTK_WINDOW(window), FALSE);
    gdk_screen_get_monitor_geometry(screen, gdk_screen_get_primary_monitor(screen), &geometry);


    gtk_window_set_default_size(GTK_WINDOW(window), geometry.width, geometry.height);
    gtk_window_move(GTK_WINDOW(window), geometry.x, geometry.y);

    web_view = webkit_web_view_new_with_settings(webkit_settings);

    gdk_rgba_parse(&bg_color, "#000000");


    if (bg_color.alpha < 1) {
        GdkVisual *rgba_visual = gdk_screen_get_rgba_visual(screen);

        if (rgba_visual) {
            gtk_widget_set_visual(GTK_WIDGET(window), rgba_visual);
            gtk_widget_set_app_paintable(GTK_WIDGET(window), TRUE);
        }
    }
    webkit_web_view_set_background_color(WEBKIT_WEB_VIEW(web_view), gdk_rgba_copy(&bg_color));


    gtk_container_add(GTK_CONTAINER(window), web_view);

    webkit_web_view_load_uri(WEBKIT_WEB_VIEW(web_view), g_strdup_printf("file://%s/%s/index.html", THEME_DIR, theme));

    /* There is no window manager, so we need to implement some of its functionality */
    GdkWindow *root_window = gdk_get_default_root_window();
    gdk_window_set_events(root_window, gdk_window_get_events(root_window) | GDK_SUBSTRUCTURE_MASK);
    gdk_window_add_filter(root_window, wm_window_filter, NULL);

    gtk_widget_show_all(window);

    gtk_main();

    return 0;
}
