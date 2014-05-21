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
#include <webkit2/webkit2.h>
#include <JavaScriptCore/JavaScript.h>
#include <glib/gi18n.h>

#include <lightdm.h>

#include <../config.h>

static GtkWidget *web_view;
static GtkWidget *window;

/*
static void
timed_login_cb (LightDMGreeter *greeter, const gchar *username, WebKitWebView *view)
{
    gchar *command;

    command = g_strdup_printf ("timed_login('%s')", username); // FIXME: Escape text
    webkit_web_view_run_javascript (view, command, NULL, web_view_javascript_finished, NULL);
    g_free (command);
}

static gboolean
fade_timer_cb (gpointer data)
{
    gdouble opacity;

    opacity = gtk_widget_get_opacity (window);
    opacity -= 0.1;
    if (opacity <= 0)
    {
        gtk_main_quit ();
        return FALSE;
    }
    gtk_widget_set_opacity (window, opacity);

    return TRUE;
}

static void
quit_cb (LightDMGreeter *greeter, const gchar *username)
{

    // Fade out the greeter
    g_timeout_add (40, (GSourceFunc) fade_timer_cb, NULL);
}
*/

static void
sigterm_cb (int signum)
{
    exit (0);
}

int
main (int argc, char **argv)
{
    GdkScreen *screen;
    GdkRectangle geometry;
    GKeyFile *keyfile;
    gchar *theme;

    WebKitWebContext *context = webkit_web_context_get_default ();

    signal (SIGTERM, sigterm_cb);

    gtk_init (&argc, &argv);
    gdk_window_set_cursor (gdk_get_default_root_window (), gdk_cursor_new (GDK_LEFT_PTR));

    webkit_web_context_set_web_extensions_directory (context, LIGHTDM_WEBKIT2_GREETER_EXTENSIONS_DIR);
    
    /* settings */
    keyfile = g_key_file_new ();
    g_key_file_load_from_file (keyfile, "/etc/lightdm/lightdm-webkit2-greeter.conf", G_KEY_FILE_NONE, NULL);
    theme = g_key_file_get_string(keyfile, "greeter", "webkit-theme", NULL);

    window = gtk_window_new (GTK_WINDOW_TOPLEVEL);
    screen = gtk_window_get_screen (GTK_WINDOW (window));
    gdk_screen_get_monitor_geometry (screen, gdk_screen_get_primary_monitor(screen), &geometry);
    gtk_window_set_default_size (GTK_WINDOW (window), geometry.width, geometry.height);
	gtk_window_move (GTK_WINDOW (window), geometry.x, geometry.y);

    web_view = webkit_web_view_new ();
    
    gtk_container_add (GTK_CONTAINER (window), web_view);

    webkit_web_view_load_uri (WEBKIT_WEB_VIEW (web_view), g_strdup_printf("file://%s/%s/index.html", THEME_DIR, theme));

    gtk_widget_show_all (window);

    gtk_main ();

    return 0;
}
