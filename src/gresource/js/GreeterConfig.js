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
	 * @type {Object}  greeter
	 *       {Boolean} greeter.debug_mode
	 *       {Boolean} greeter.secure_mode
	 *       {Number}  greeter.screensaver_timeout
	 *       {String}  greeter.time_format
	 *       {String}  greeter.time_language
	 *       {String}  greeter.webkit_theme
	 *
	 * @readonly
	 */
	get greeter() {
		if ( null === _greeter ) {
			let bools = {'debug_mode': true, 'secure_mode': true},
				strings = {'time_format': 'LT', 'time_language': 'auto', 'webkit_theme': 'antergos'},
				numbers = {'screensaver_timeout': 30};

			_greeter = {};

			set_values( bools, _greeter, this.get_bool );
			set_values( strings, _greeter, this.get_str );
			set_values( numbers, _greeter, this.get_num );
		}

		return _greeter;
	}

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
	get_bool( config_section, key ) {
		return __GreeterConfig.get_bool( config_section, key );
	}

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
	get_num( config_section, key ) {
		return __GreeterConfig.get_num( config_section, key );
	}

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
 * @memberOf window
 * @type {LightDM.GreeterConfig}
 */
__greeter_config.then( result => {
	window.greeter_config = result;

	/**
	 * @deprecated
	 * @type {LightDM.GreeterConfig}
	 */
	window.config = window.greeter_config;
} );



