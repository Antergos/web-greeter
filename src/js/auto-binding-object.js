/*
 * auto-binding-object.js
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
 * Generic base class that automatically binds `this` to the instance for all class methods.
 * It is made available in the global scope and can be used in greeter themes if needed/wanted.
 */
class AutoBindingObject {
	/**
	 * Creates a new {@link AutoBindingObject} instance.
	 */
	constructor() {
		this.__bind_this();
	}

	/**
	 * Binds `this` to the class for all class methods.
	 *
	 * @private
	 */
	__bind_this() {
		let excluded_methods = ['constructor', '__bind_this'];

		function not_excluded( method, context ) {
			let _is_excluded = excluded_methods.findIndex( excluded_method => method === excluded_method ) > -1,
				is_method = 'function' === typeof context[method];

			return is_method && !_is_excluded;
		}

		for ( let obj = this; obj; obj = Object.getPrototypeOf( obj ) ) {
			// Handle only our methods
			if ( 'Object' === obj.constructor.name ) {
				break;
			}

			for ( let method of Object.getOwnPropertyNames( obj ) ) {
				if ( not_excluded( method, this ) ) {
					this[method] = this[method].bind( this );
				}
			}
		}

	}
}


window.AutoBindingObject = AutoBindingObject;
