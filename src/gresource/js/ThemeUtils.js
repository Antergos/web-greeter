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



/**
 * Provides various utility methods for use by theme authors. The greeter will automatically
 * create an instance of this class when it starts. The instance can be accessed
 * with the global variable: `theme_utils`.
 *
 * @memberOf LightDM
 */
class ThemeUtils  {
	/**
	 * Binds `this` to class, `context`, for all of the class's methods.
	 *
	 * @arg {function(new:*): Object} context An ES6 class (not an instance) with at least one method.
	 *
	 * @return {function(new:*): Object} `context` with `this` bound to it for all of its methods.
	 */
	static bind_this( context ) {
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

	static
}

window.theme_utils = __ThemeUtils;
window.theme_utils.bind_this = ThemeUtils.bind_this;

/* -------->>> DEPRECATED! <<<-------- */
window.greeterutil = window.theme_utils;
/* -------->>> DEPRECATED! <<<-------- */
