/*
 * GreeterConfig.js
 *
 * Copyright © 2016 Antergos Developers <dev@antergos.com>
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


/**
 * Provides theme authors with a way to retrieve values from the greeter's config
 * file located at `/etc/lightdm/lightdm-webkit2-greeter.conf`. The greeter will
 * create an instance of this class when it starts. The instance can be accessed
 * with the global variable: `greeter_config`.
 *
 * @memberOf LightDM
 */
class GreeterConfig  {
	/**
	 * Holds keys/values from the `branding` section of the config file.
	 *
	 * @type {Object} branding
	 *       {String} branding.background_images
	 *       {String} branding.logo
	 *       {String} branding.user_image
	 *
	 * @readonly
	 */
	get branding() {}

	/**
	 * Holds keys/values from the `greeter` section of the config file.
	 *
	 * @type {Object}  greeter
	 *       {Boolean} greeter.debug_mode
	 *       {Boolean} greeter.secure_mode
	 *       {Number}  greeter.screensaver_timeout
	 *       {String}  greeter.webkit_theme
	 *
	 * @readonly
	 */
	get greeter() {}

	/**
	 * Returns the value of `key` from the `config_section` of the greeter's config file.
	 *
	 * @deprecated Access config sections directly as properties of this object instead.
	 *
	 * @arg {String} config_section
	 * @arg {String} key
	 *
	 * @returns {Boolean} Config value for `key`.
	 */
	get_bool( config_section, key ) {}

	/**
	 * Returns the value of `key` from the `config_section` of the greeter's config file.
	 *
	 * @deprecated Access config sections directly as properties of this object instead.
	 *
	 * @arg {String} config_section
	 * @arg {String} key
	 *
	 * @returns {Number} Config value for `key`.
	 */
	get_num( config_section, key ) {}

	/**
	 * Returns the value of `key` from the `config_section` of the greeter's config file.
	 *
	 * @deprecated Access config sections directly as properties of this object instead.
	 *
	 * @arg {String} config_section
	 * @arg {String} key
	 *
	 * @returns {String} Config value for `key`.
	 */
	get_str( key ) {}
}


/**
 * @memberOf window
 * @type {LightDM.GreeterConfig}
 */
window.greeter_config = __GreeterConfig;

/* -------->>> DEPRECATED! <<<-------- */
window.config = window.greeter_config;
/* -------->>> DEPRECATED! <<<-------- */
