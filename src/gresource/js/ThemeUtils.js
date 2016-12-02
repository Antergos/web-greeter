/*
 * GreeterUtils.js
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

if ( 'undefined' === typeof window.navigator.languages ) {
	window.navigator.languages = [ window.navigator.language ];
}

moment.locale( window.navigator.languages );

let localized_invalid_date = moment('today', '!@#'),
	time_language = null,
	time_format = null,
	allowed_dirs = null;



/**
 * Provides various utility methods for use by theme authors. The greeter will automatically
 * create an instance of this class when it starts. The instance can be accessed
 * with the global variable: [`theme_utils`]({@link window.theme_utils}).
 *
 * @memberOf LightDM
 */
class ThemeUtils {
	/**
	 * Binds `this` to class, `context`, for all of the class's methods.
	 *
	 * @arg {Object} context An ES6 class instance with at least one method.
	 *
	 * @return {Object} `context` with `this` bound to it for all of its methods.
	 */
	bind_this( context ) {
		let excluded_methods = ['constructor'];

		function not_excluded( _method, _context ) {
			let is_excluded = excluded_methods.findIndex( excluded_method => _method === excluded_method ) > -1,
				is_method = 'function' === typeof _context[_method];

			return is_method && !is_excluded;
		}

		for ( let obj = context; obj; obj = Object.getPrototypeOf( obj ) ) {
			// Stop once we have traveled all the way up the inheritance chain
			if ( 'Object' === obj.constructor.name ) {
				break;
			}

			for ( let method of Object.getOwnPropertyNames( obj ) ) {
				if ( not_excluded( method, context ) ) {
					context[method] = context[method].bind( context );
				}
			}
		}
	}


	/**
	 * Returns the contents of directory found at `path` provided that the (normalized) `path`
	 * meets at least one of the following conditions:
	 *   * Is located within the greeter themes' root directory.
	 *   * Has been explicitly allowed in the greeter's config file.
	 *   * Is located within the greeter's shared data directory (`/var/lib/lightdm-data`)
	 *
	 * @param {String} path The abs path to desired directory.
	 *
	 * @returns {String[]} List of abs paths for the files and directories found in `path`.
	 */
	dirlist( path ) {
		let allowed = true;

		if ( '' === path || ! path instanceof String ) {
			console.log('[ERROR] theme_utils.dirlist(): path must be a non-empty string!');
			allowed = false;

		} else if ( null !== path.match(/^[^/].+/) ) {
			console.log('[ERROR] theme_utils.dirlist(): path must not include be absolute!');
			allowed = false;
		}

		if ( null !== path.match(/\/\.+(?=\/)/) ) {
			// No special directory names allowed (eg ../../)
			path = path.replace(/\/\.+(?=\/)/g, '' );
		}

		if ( null === allowed_dirs ) {
			let user = lightdm.users.pop();

			allowed_dirs = {
				themes_dir: greeter_config.get_str( user.username, 'lightdm_data_dir' ),
				backgrounds_dir: greeter_config.get_str( 'greeter', 'themes_dir' ),
				lightdm_data_dir: greeter_config.get_str( 'branding', 'background_images' ),
				tmpdir: '/tmp'
			};
		}

		if ( ! Object.keys( allowed_dirs ).some( dir => path.startsWith( allowed_dirs[dir] ) ) ) {
			console.log(`[ERROR] theme_utils.dirlist(): path is not allowed: ${path}`);
			allowed = false;
		}

		if ( ! allowed ) {
			return [];
		}

		try {
			return __ThemeUtils.dirlist( path );

		} catch( err ) {
			console.log( `[ERROR] theme_utils.dirlist(): ${err}` );
			return [];
		}
	}

	/**
	 * Escape HTML entities in a string.
	 *
	 * @param {String} text The text to be escaped.
	 *
	 * @returns {String}
	 */
	esc_html( text ) {
		return this.txt2html( text );
	}


	/**
	 * Get the current time in a localized format. Time format and language are auto-detected
	 * by default, but can be set manually in the greeter config file.
	 *   * `language` defaults to the system's language, but can be set manually in the config file.
	 *   * When `time_format` config file option has a valid value, time will be formatted
	 *     according to that value.
	 *   * When `time_format` does not have a valid value, the time format will be `LT`
	 *     which is `1:00 PM` or `13:00` depending on the system's locale.
	 *
	 * @return {String} The current localized time.
	 */
	get_current_localized_time() {
		if ( null === time_language ) {
			let config = greeter_config.greeter,
				manual_language = ( '' !== config.time_language && 'auto' !== config.time_language ),
				manual_time_format = ( '' !== config.time_format && 'auto' !== config.time_format );

			time_language =  manual_language ? config.time_language : window.navigator.language;
			time_format = manual_time_format ? config.time_format : 'LT';

			if ( manual_language ) {
				moment.locale( time_language );
			}
		}

		let local_time = moment().format( time_format );

		if ( local_time === localized_invalid_date ) {
			local_time = moment().format( 'LT' );
		}

		return local_time;
	}


	/**
	 * @deprecated Use {@link theme_utils.esc_html()} instead.
	 */
	txt2html( text ) {
		try {
			return __ThemeUtils.txt2html( text );

		} catch( err ) {
			console.log( `[ERROR] theme_utils.dirlist(): ${err}` );
			return text;
		}
	}
}


const __theme_utils = new Promise( (resolve, reject) => {
	let waiting = 0;

	const check_window_prop = () => {
		if ( waiting > 15000 ) {
			return reject( 'Timeout Reached!');
		}

		setTimeout( () => {
			waiting += 1;

			if ( '__ThemeUtils' in window ) {
				return resolve( (() => new ThemeUtils())() );
			}

			check_window_prop();
		}, 0 );
	};

	check_window_prop();
});


/**
 * @alias theme_utils
 * @type {LightDM.ThemeUtils}
 * @memberOf window
 */
__theme_utils.then( result => {
	window.theme_utils = result;

	/**
	 * @alias greeterutil
	 * @type {LightDM.ThemeUtils}
	 * @memberOf window
	 * @deprecated Use [`theme_utils`]({@link window.theme_utils}) instead.
	 */
	window.greeterutil = window.theme_utils;
} );
