/*
 * greeter-config.c
 *
 * Copyright © 2017 Antergos Developers <dev@antergos.com>
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
 */

#include <string.h>
#include <gtk/gtk.h>

#include "greeter-config.h"
#include "config.h"
#include "greeter-resources.h"

/* Work-around CLion bug */
#ifndef CONFIG_DIR
#include "../build/src/config.h"
#include "../build/src/greeter-resources.h"
#endif

static Config config_instance;
static Config *config_instance_p = NULL;


static void
apply_defaults(void) {
	config_instance.greeter->debug_mode = FALSE;
	config_instance.greeter->detect_theme_errors = TRUE;
	config_instance.greeter->secure_mode = TRUE;
	config_instance.greeter->screensaver_timeout = 300;
	config_instance.greeter->time_format = "LT";
	config_instance.greeter->time_language = "auto";
	config_instance.greeter->webkit_theme = "antergos";

	config_instance.branding->background_images = BACKGROUND_IMAGES_DIR;
	config_instance.branding->logo = LOGO_IMAGE;
	config_instance.branding->user_image = USER_IMAGE;
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


Config*
get_config(void) {
	if (NULL != config_instance_p) {
		return config_instance_p;
	}

	// Apply default config.
	apply_defaults();

	GError *err = NULL;
	GKeyFile *keyfile = g_key_file_new();

	g_key_file_load_from_file(keyfile, CONFIG_FILE, G_KEY_FILE_NONE, &err);

	if (NULL != err) {
		g_clear_error(&err);
		g_key_file_load_from_file(keyfile, CONFIG_FILE_LEGACY, G_KEY_FILE_NONE, &err);

		if (NULL != err) {
			// Can't load config file. Bail.
			goto cleanup;
		}
	}


	/* ----->>> WebKit Theme <<<----- */
	gchar *theme = g_key_file_get_string(keyfile, "greeter", "webkit_theme", &err);

	if (NULL != err) {
		g_clear_error(&err);
		theme = g_key_file_get_string(keyfile, "greeter", "webkit-theme", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.greeter->webkit_theme = rtrim_comments(theme);
	}


	/* ----->>> Screensaver Timeout <<<----- */
	gint screensaver_timeout = g_key_file_get_integer(keyfile, "greeter", "screensaver_timeout", &err);

	if (NULL != err) {
		g_clear_error(&err);
		screensaver_timeout = g_key_file_get_integer(keyfile, "greeter", "screensaver-timeout", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.greeter->screensaver_timeout = screensaver_timeout;
	}


	/* ----->>> Debug Mode <<<----- */
	gboolean debug_mode = g_key_file_get_boolean(keyfile, "greeter", "debug_mode", &err);

	if (NULL != err) {
		g_clear_error(&err);
		debug_mode = g_key_file_get_integer(keyfile, "greeter", "debug-mode", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.greeter->debug_mode = debug_mode;
	}


	/* ----->>> Secure Mode <<<----- */
	gboolean secure_mode = g_key_file_get_boolean(keyfile, "greeter", "secure_mode", &err);

	if (NULL != err) {
		g_clear_error(&err);
		secure_mode = g_key_file_get_integer(keyfile, "greeter", "secure-mode", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.greeter->secure_mode = secure_mode;
	}


	/* ----->>> Theme Error Detection <<<----- */
	gboolean detect_theme_errors = g_key_file_get_boolean(keyfile, "greeter", "detect_theme_errors", &err);

	if (NULL != err) {
		g_clear_error(&err);
		detect_theme_errors = g_key_file_get_integer(keyfile, "greeter", "detect-theme-errors", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.greeter->detect_theme_errors = detect_theme_errors;
	}


	/* ----->>> Time Format <<<----- */
	gchar *time_format = g_key_file_get_string(keyfile, "greeter", "time_format", &err);

	if (NULL != err) {
		g_clear_error(&err);
		time_format = g_key_file_get_string(keyfile, "greeter", "time-format", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.greeter->time_format = time_format;
	}


	/* ----->>> Time Language <<<----- */
	gchar *time_language = g_key_file_get_string(keyfile, "greeter", "time_language", &err);

	if (NULL != err) {
		g_clear_error(&err);
		time_language = g_key_file_get_string(keyfile, "greeter", "time-language", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.greeter->time_language = time_language;
	}


	/* ----->>> Background Images Directory <<<----- */
	gchar *background_images = g_key_file_get_string(keyfile, "branding", "background_images", &err);

	if (NULL != err) {
		g_clear_error(&err);
		background_images = g_key_file_get_string(keyfile, "branding", "background-images", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.branding->background_images = background_images;
	}


	/* ----->>> User Avatar Image <<<----- */
	gchar *user_image = g_key_file_get_string(keyfile, "branding", "user_image", &err);

	if (NULL != err) {
		g_clear_error(&err);
		user_image = g_key_file_get_string(keyfile, "branding", "user-image", &err);
	}

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.branding->user_image = user_image;
	}


	/* ----->>> Logo <<<----- */
	gchar *logo = g_key_file_get_string(keyfile, "branding", "logo", &err);

	if (NULL != err) {
		g_clear_error(&err);
	} else {
		config_instance.branding->logo = logo;
	}

	goto cleanup;


	cleanup:
		config_instance_p = &config_instance;

		if (NULL != err) {
			g_error_free(err);
		}

		return config_instance_p;
}
