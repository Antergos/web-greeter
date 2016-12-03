/*
 * LightDMGreeter.js
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
 * The global window object.
 * @external window
 * @type     {Object}
 * @global
 */


/**
 * Base class for the greeter's JavaScript Theme API. Greeter themes will interact
 * directly with an object derived from this class to facilitate the user log-in process.
 * The greeter will automatically create an instance when it starts.
 * The instance can be accessed using the global variable: {@link window.lightdm}.
 *
 * @memberOf LightDM
 */
class Greeter {

	constructor() {
		if ( 'lightdm' in window ) {
			return window.lightdm;
		}

		window.lightdm = GreeterUtils.bind_this( this );

		return window.lightdm;
	}

	/**
	 * The username of the user being authenticated or {@link null}
	 * if there is no authentication in progress.
	 * @type {String|null}
	 * @readonly
	 */
	get authentication_user() {}

	/**
	 * Whether or not the guest account should be automatically logged
	 * into when the timer expires.
	 * @type {Boolean}
	 * @readonly
	 */
	get autologin_guest() {}

	/**
	 * The number of seconds to wait before automatically logging in.
	 * @type {Number}
	 * @readonly
	 */
	get autologin_timeout() {}

	/**
	 * The username with which to automatically log in when the timer expires.
	 * @type {String}
	 * @readonly
	 */
	get autologin_user() {}

	/**
	 * Whether or not the greeter can make the system hibernate.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_hibernate() {}

	/**
	 * Whether or not the greeter can make the system restart.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_restart() {}

	/**
	 * Whether or not the greeter can make the system shutdown.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_shutdown() {}

	/**
	 * Whether or not the greeter can make the system suspend/sleep.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_suspend() {}

	/**
	 * The name of the default session.
	 * @type {String}
	 * @readonly
	 */
	get default_session() {}

	/**
	 * Whether or not guest sessions are supported.
	 * @type {Boolean}
	 * @readonly
	 */
	get has_guest_account() {}

	/**
	 * Whether or not user accounts should be hidden.
	 * @type {Boolean}
	 * @readonly
	 */
	get hide_users() {}

	/**
	 * The system's hostname.
	 * @type {String}
	 * @readonly
	 */
	get hostname() {}

	/**
	 * Whether or not the greeter is in the process of authenticating.
	 * @type {Boolean}
	 * @readonly
	 */
	get in_authentication() {}

	/**
	 * Whether or not the greeter has successfully authenticated.
	 * @type {Boolean}
	 * @readonly
	 */
	get is_authenticated() {}

	/**
	 * The current language or {@link null} if no language.
	 * @type {LightDMLanguage|null}
	 * @readonly
	 */
	get language() {}

	/**
	 * A list of languages to present to the user.
	 * @type {LightDMLanguage[]}
	 * @readonly
	 */
	get languages() {}

	/**
	 * The currently active layout for the selected user.
	 * @type {LightDMLayout}
	 */
	get layout() {}

	/**
	 * Set the active layout for the selected user.
	 * @param {LightDMLayout} value
	 */
	set layout( value ) {}

	/**
	 * A list of keyboard layouts to present to the user.
	 * @type {LightDMLayout[]}
	 * @readonly
	 */
	get layouts() {}

	/**
	 * Whether or not the greeter was started as a lock screen.
	 * @type {Boolean}
	 * @readonly
	 */
	get lock_hint() {}

	/**
	 * The number of users able to log in.
	 * @type {Number}
	 * @readonly
	 */
	get num_users() {
		return this.users.length;
	}

	/**
	 * Whether or not the guest account should be selected by default.
	 * @type {Boolean}
	 * @readonly
	 */
	get select_guest_hint() {}

	/**
	 * The username to select by default.
	 * @type {String}
	 * @readonly
	 */
	get select_user_hint() {}

	/**
	 * List of available sessions.
	 * @type {LightDMSession[]}
	 * @readonly
	 */
	get sessions() {}

	/**
	 * List of available users.
	 * @type {LightDMUser[]}
	 * @readonly
	 */
	get users() {}


	/**
	 * Starts the authentication procedure for a user.
	 *
	 * @arg {String|null} username A username or {@link null} to prompt for a username.
	 */
	authenticate( username = null ) {}

	/**
	 * Starts the authentication procedure for the guest user.
	 */
	authenticate_as_guest() {}

	/**
	 * Cancel the user authentication that is currently in progress.
	 */
	cancel_authentication() {}

	/**
	 * Cancel the automatic login.
	 */
	cancel_autologin() {}

	/**
	 * Get the value of a hint.
	 * @arg {String} name The name of the hint to get.
	 * @returns {String|Boolean|Number|null}
	 */
	get_hint( name ) {}

	/**
	 * Triggers the system to hibernate.
	 * @returns {Boolean} {@link true} if hibernation initiated, otherwise {@link false}
	 */
	hibernate() {
		return this._do_mocked_system_action('hibernate');
	}

	/**
	 * Provide a response to a prompt.
	 * @arg {*} response
	 */
	respond( response ) {}

	/**
	 * Triggers the system to restart.
	 * @returns {Boolean} {@link true} if restart initiated, otherwise {@link false}
	 */
	restart() {}

	/**
	 * Set the language for the currently authenticated user.
	 * @arg {String} language The language in the form of a locale specification (e.g. 'de_DE.UTF-8')
	 * @returns {Boolean} {@link true} if successful, otherwise {@link false}
	 */
	set_language( language ) {}

	/**
	 * Triggers the system to shutdown.
	 * @returns {Boolean} {@link true} if shutdown initiated, otherwise {@link false}
	 */
	shutdown() {}

	/**
	 * Start a session for the authenticated user.
	 * @arg {String|null} session The session to log into or {@link null} to use the default.
	 * @returns {Boolean} {@link true} if successful, otherwise {@link false}
	 */
	start_session( session ) {}

	/**
	 * Triggers the system to suspend/sleep.
	 * @returns {Boolean} {@link true} if suspend/sleep initiated, otherwise {@link false}
	 */
	suspend() {}

}


const __lightdm = new Promise( (resolve, reject) => {
	let waiting = 0;

	const check_window_prop = () => {
		if ( waiting > 15000 ) {
			return reject( 'Timeout Reached!');
		}

		setTimeout( () => {
			waiting += 1;

			if ( '__LightDMGreeter' in window ) {
				return resolve( window.__LightDMGreeter );
			}

			check_window_prop();
		}, 0 );
	};

	check_window_prop();
});


/**
 * @alias lightdm
 * @type {LightDM.Greeter}
 * @memberOf window
 */
__lightdm.then( result => window.lightdm = result );


/**
 * Moment.js instance - Loaded and instantiated automatically by the greeter.
 * @external moment
 * @type {Object}
 * @version 2.17.0
 * @memberOf window
 * @see {@link [Moment.js Documentation](http://momentjs.com/docs)}
 */

/**
 * jQuery instance - Themes must manually load the included vendor script in order to use this object.
 * @external jQuery
 * @type {Object}
 * @version 3.1.1
 * @memberOf window
 * @see {@link [jQuery Documentation](http://api.jquery.com)}
 */

/**
 * @external $
 * @memberOf window
 * @see {@link window.jQuery}
 */

/**
 * JS-Cookie instance - Themes must manually load the included vendor script in order to use this object.
 * @name Cookies
 * @type {Object}
 * @version 2.1.3
 * @memberOf window
 * @see {@link [JS Cookie Documentation](https://github.com/js-cookie/js-cookie/tree/latest#readme)}
 */


