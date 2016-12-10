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


let _branding = null,
	_greeter = null;


function set_values( defaults, target_obj, method ) {
	let keys = Object.keys(defaults);

	keys.forEach( prop => {
		try {
			target_obj[prop] = method( 'greeter', prop );
		} catch(err) {
			target_obj[prop] = defaults[prop];
		}
	});
}


/**
 * Provides greeter themes with a way to access values from the greeter's config
 * file located at `/etc/lightdm/lightdm-webkit2-greeter.conf`. The greeter will
 * create an instance of this class when it starts. The instance can be accessed
 * with the global variable: [`greeter_config`](#dl-window-greeter_config).
 *
 * @memberOf LightDM
 */
class GreeterConfig  {
	/**
	 * Holds keys/values from the `branding` section of the config file.
	 *
	 * @type {object} branding
	 * @prop {string} background_images Path to directory that contains background images
	 *                                  for use in greeter themes.
	 * @prop {string} logo              Path to distro logo image for use in greeter themes.
	 * @prop {string} user_image        Default user image/avatar. This is used by greeter themes
	 *                                  for users that have not configured a `.face` image.
	 * @readonly
	 */
	get branding() {
		if ( null === _branding ) {
			let theme_dir = '/usr/share/lightdm-webkit/themes/antergos',
				props = {
					'background_images': '/usr/share/backgrounds',
					'logo': `${theme_dir}/img/antergos-logo-user.png`,
					'user_image': `${theme_dir}/img/antergos.png`
			};

			_branding = {};

			set_values( props, _branding, this.get_str );
		}

		return _branding;
	}

	/**
	 * Holds keys/values from the `greeter` section of the config file.
	 *
	 * @type {object}  greeter
	 * @prop {boolean} debug_mode          Greeter theme debug mode.
	 * @prop {boolean} detect_theme_errors Provide an option to load a fallback theme when theme
	 *                                     errors are detected.
	 * @prop {number}  screensaver_timeout Blank the screen after this many seconds of inactivity.
	 * @prop {boolean} secure_mode         Don't allow themes to make remote http requests.
	 * @prop {string}  time_format         A moment.js format string to be used by the greeter to
	 *                                     generate localized time for display.
	 * @prop {string}  time_language       Language to use when displaying the time or `auto`
	 *                                     to use the system's language.
	 * @prop {string}  webkit_theme        The name of the theme to be used by the greeter.
	 * @readonly
	 */
	get greeter() {
		if ( null === _greeter ) {
			let bools = {'debug_mode': false, 'secure_mode': true, 'detect_theme_errors': true},
				strings = {'time_format': 'LT', 'time_language': 'auto', 'webkit_theme': 'antergos'},
				numbers = {'screensaver_timeout': 300};

			_greeter = {};

			set_values( bools, _greeter, this.get_bool );
			set_values( strings, _greeter, this.get_str );
			set_values( numbers, _greeter, this.get_num );
		}

		return _greeter;
	}

	/**
	 * ***Deprecated!*** Access config sections directly as properties of this object instead.
	 *
	 * @deprecated
	 *
	 * @arg {string} config_section
	 * @arg {string} key
	 *
	 * @returns {boolean} Config value for `key`.
	 */
	get_bool( config_section, key ) {
		return __GreeterConfig.get_bool( config_section, key );
	}

	/**
	 * ***Deprecated!*** Access config sections directly as properties of this object instead.
	 *
	 * @deprecated
	 *
	 * @arg {string} config_section
	 * @arg {string} key
	 *
	 * @returns {number} Config value for `key`.
	 */
	get_num( config_section, key ) {
		return __GreeterConfig.get_num( config_section, key );
	}

	/**
	 * ***Deprecated!*** Access config sections directly as properties of this object instead.
	 *
	 * @deprecated
	 *
	 * @arg {string} config_section
	 * @arg {string} key
	 *
	 * @returns {string} Config value for `key`.
	 */
	get_str( config_section, key ) {
		return __GreeterConfig.get_str( config_section, key );
	}
}


const __greeter_config = new Promise( (resolve, reject) => {
	let waiting = 0;

	const check_window_prop = () => {
		if ( waiting > 15000 ) {
			return reject( 'Timeout Reached!');
		}

		setTimeout( () => {
			waiting += 1;

			if ( '__GreeterConfig' in window ) {
				return resolve( (() => new GreeterConfig())() );
			}

			check_window_prop();
		}, 0 );
	};

	check_window_prop();
});


/**
 * Greeter Config - Access values from the greeter's config file.
 * @name greeter_config
 * @type {LightDM.GreeterConfig}
 * @memberOf window
 */
__greeter_config.then( result => {
	window.greeter_config = result;

	/**
	 * ***Deprecated!*** Use {@link window.greeter_config} instead.
	 * @name config
	 * @type {LightDM.GreeterConfig}
	 * @memberOf window
	 * @deprecated
	 */
	window.config = window.greeter_config;
} );



