/*
 * Copyright © 2015-2016 Antergos
 *
 * LightDMObjects.js
 *
 * This file is part of lightdm-webkit2-greeter
 *
 * lightdm-webkit2-greeter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * lightdm-webkit2-greeter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of the license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The global window object.
 *
 * @name window
 * @type {object}
 * @global
 */

/**
 * The greeter's Theme JavaScript API.
 *
 * @namespace LightDM
 */


/**
 * Interface for object that holds info about a session. Session objects are not
 * created by the theme's code, but rather by the {@link LightDM.Greeter} class.
 *
 * @memberOf LightDM
 */
class Session  {
	constructor(  { comment, key, name } ) {
		/**
		 * The comment for the session.
		 * @type {string}
		 * @readonly
		 */
		this.comment = comment;

		/**
		 * The key for the session.
		 * @type {string}
		 * @readonly
		 */
		this.key = key;

		/**
		 * The name for the session.
		 * @type {string}
		 * @readonly
		 */
		this.name = name;
	}
}


/**
 * Interface for object that holds info about a language on the system. Language objects are not
 * created by the theme's code, but rather by the {@link LightDM.Greeter} class.
 *
 * @memberOf LightDM
 */
class Language {
	constructor(  { code, name, territory } ) {
		/**
		 * The code for the language.
		 * @type {string}
		 * @readonly
		 */
		this.code = code;

		/**
		 * The name for the language.
		 * @type {string}
		 * @readonly
		 */
		this.name = name;

		/**
		 * The territory for the language.
		 * @type {string}
		 * @readonly
		 */
		this.territory = territory;
	}
}


/**
 * Interface for object that holds info about a keyboard layout on the system. Language
 * objects are not created by the theme's code, but rather by the {@link LightDM.Greeter} class.
 *
 * @memberOf LightDM
 */
class Layout {
	constructor(  { description, name, short_description } ) {
		/**
		 * The description for the layout.
		 * @type {string}
		 * @readonly
		 */
		this.description = description;

		/**
		 * The name for the layout.
		 * @type {string}
		 * @readonly
		 */
		this.name = name;

		/**
		 * The territory for the layout.
		 * @type {string}
		 * @readonly
		 */
		this.short_description = short_description;
	}
}


/**
 * Interface for object that holds info about a user account on the system. User
 * objects are not created by the theme's code, but rather by the {@link LightDM.Greeter} class.
 *
 * @memberOf LightDM
 */
class User {
	constructor( user_info ) {
		/**
		 * The display name for the user.
		 * @type {string}
		 * @readonly
		 */
		this.display_name = user_info.display_name;

		/**
		 * The language for the user.
		 * @type {string}
		 * @readonly
		 */
		this.language = user_info.language;

		/**
		 * The keyboard layout for the user.
		 * @type {string}
		 * @readonly
		 */
		this.layout = user_info.layout;

		/**
		 * The image for the user.
		 * @type {string}
		 * @readonly
		 */
		this.image = user_info.image;

		/**
		 * The home_directory for the user.
		 * @type {string}
		 * @readonly
		 */
		this.home_directory = user_info.home_directory;

		/**
		 * The username for the user.
		 * @type {string}
		 * @readonly
		 */
		this.username = user_info.username;

		/**
		 * Whether or not the user is currently logged in.
		 * @type {boolean}
		 * @readonly
		 */
		this.logged_in = user_info.logged_in;

		/**
		 * The last session that the user logged into.
		 * @type {string|null}
		 * @readonly
		 */
		this.session = user_info.session;

		/**
		 * ***Deprecated!*** See {@link LightDM.User#username}.
		 * @deprecated
		 * @type {string}
		 * @readonly
		 */
		this.name = user_info.name;

		/**
		 * ***Deprecated!*** See {@link LightDM.User#display_name}.
		 * @deprecated
		 * @type {string}
		 * @readonly
		 */
		this.real_name = user_info.real_name;
	}
}
