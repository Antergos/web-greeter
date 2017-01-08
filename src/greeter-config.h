/*
 * greeter-config.h
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

#ifndef LIGHTDM_WEBKIT2_GREETER_GREETER_CONFIG_H
#define LIGHTDM_WEBKIT2_GREETER_GREETER_CONFIG_H

#include <glib.h>

typedef struct greeter_config {
	gboolean debug_mode;
	gboolean detect_theme_errors;
	gint screensaver_timeout;
	gboolean secure_mode;
	gchar *time_format;
	gchar *time_language;
	gchar *webkit_theme;
} Greeter_Config;

typedef struct branding_config {
	gchar *background_images;
	gchar *logo;
	gchar *user_image;
} Branding_Config;

typedef struct config {
	Greeter_Config *greeter;
	Branding_Config *branding;
} Config;


Config* get_config(void);


#endif // LIGHTDM_WEBKIT2_GREETER_GREETER_CONFIG_H
