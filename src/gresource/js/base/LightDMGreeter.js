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
 * Singleton class which implements the LightDMGreeter Interface. Greeter themes will
 * interact directly with this class to facilitate the user log in processes.
 * The greeter will automatically create an instance of this class when it starts.
 * The instance can be accessed with the global variable: `lightdm`.
 * @memberOf LightDM
 */
class LightDMGreeter {

	constructor() {
		if ( null !== lightdm ) {
			return lightdm;
		}

		lightdm = this;
		this._mock_data = MockData();

		this._initialize();
	}

	/**
	 * @private
	 */
	_do_mocked_system_action( action ) {
		alert(`System ${action} triggered.`);
		document.location.reload(true);
		return true;
	}

	/**
	 * @private
	 */
	_initialize() {
		this._set_default_property_values();
	}

	/**
	 * @private
	 */
	_populate_ldm_object_arrays() {
		for ( let object_type of ['sessions', 'users', 'languages', 'layouts'] ) {
			let object_name = object_type.slice(0, -1).capitalize(),
				ObjectClass = `LightDM${object_name}`;

			for ( let object_info of this._mock_data[object_type] ) {
				this[object_type].push(MockObjects[ObjectClass](object_info));
			}
		}
	}

	/**
	 * @private
	 */
	_set_default_property_values() {
		for ( let property_type of Object.keys(this._mock_data.greeter.properties) ) {
			for ( let property of this._mock_data.greeter.properties[property_type] ) {
				if ( property.indexOf('can_') > -1 ) {
					// System Power Actions
					this[`_${property}`] = true;
				} else {
					this[`_${property}`] = this._mock_data.greeter.default_values[property_type]();
				}
			}
		}

		this._populate_ldm_object_arrays();
	}

	/**
	 * The username of the user being authenticated or {@link null}
	 * if no authentication is in progress.
	 * @type {String|null}
	 * @readonly
	 */
	get authentication_user() {
		return this._authentication_user;
	}

	/**
	 * Whether or not the guest account should be automatically logged
	 * into when the timer expires.
	 * @type {Boolean}
	 * @readonly
	 */
	get autologin_guest() {
		return this._autologin_guest;
	}

	/**
	 * The number of seconds to wait before automatically logging in.
	 * @type {Number}
	 * @readonly
	 */
	get autologin_timeout() {
		return this._autologin_timeout;
	}

	/**
	 * The username with which to automatically log in when the timer expires.
	 * @type {String}
	 * @readonly
	 */
	get autologin_user() {
		return this._autologin_user;
	}

	/**
	 * Whether or not the greeter can make the system hibernate.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_hibernate() {
		return this._can_hibernate;
	}

	/**
	 * Whether or not the greeter can make the system restart.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_restart() {
		return this._can_restart;
	}

	/**
	 * Whether or not the greeter can make the system shutdown.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_shutdown() {
		return this._can_shutdown;
	}

	/**
	 * Whether or not the greeter can make the system suspend/sleep.
	 * @type {Boolean}
	 * @readonly
	 */
	get can_suspend() {
		return this._can_suspend;
	}

	/**
	 * The name of the default session.
	 * @type {String}
	 * @readonly
	 */
	get default_session() {
		return this._default_session;
	}

	/**
	 * Whether or not guest sessions are supported.
	 * @type {Boolean}
	 * @readonly
	 */
	get has_guest_account() {
		return this._has_guest_account;
	}

	/**
	 * Whether or not user accounts should be hidden.
	 * @type {Boolean}
	 * @readonly
	 */
	get hide_users() {
		return this._hide_users;
	}

	/**
	 * The system's hostname.
	 * @type {String}
	 * @readonly
	 */
	get hostname() {
		return this._hostname;
	}

	/**
	 * Whether or not the greeter is in the process of authenticating.
	 * @type {Boolean}
	 * @readonly
	 */
	get in_authentication() {
		return this._in_authentication;
	}

	/**
	 * Whether or not the greeter has successfully authenticated.
	 * @type {Boolean}
	 * @readonly
	 */
	get is_authenticated() {
		return this._is_authenticated;
	}

	/**
	 * The current language or {@link null} if no language.
	 * @type {LightDMLanguage|null}
	 * @readonly
	 */
	get language() {
		return this._language;
	}

	/**
	 * A list of languages to present to the user.
	 * @type {LightDMLanguage[]}
	 * @readonly
	 */
	get languages() {
		return this._languages;
	}

	/**
	 * The currently active layout for the selected user.
	 * @type {LightDMLayout}
	 */
	get layout() {
		return this._layout;
	}

	set layout( value ) {
		this._layout = value;
	}

	/**
	 * A list of keyboard layouts to present to the user.
	 * @type {LightDMLayout[]}
	 * @readonly
	 */
	get layouts() {
		return this._layouts;
	}

	/**
	 * Whether or not the greeter was started as a lock screen.
	 * @type {Boolean}
	 * @readonly
	 */
	get lock_hint() {
		return this._lock_hint;
	}

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
	get select_guest_hint() {
		return this._select_guest_hint;
	}

	/**
	 * The username to select by default.
	 * @type {String}
	 * @readonly
	 */
	get select_user_hint() {
		return this._select_user_hint;
	}

	/**
	 * List of available sessions.
	 * @type {LightDMSession[]}
	 * @readonly
	 */
	get sessions() {
		return this._sessions;
	}

	/**
	 * List of available users.
	 * @type {LightDMUser[]}
	 * @readonly
	 */
	get users() {
		return this._users;
	}


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
	 * Cancel user authentication that is currently in progress.
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
	restart() {
		return this._do_mocked_system_action('restart');
	}

	/**
	 * Set the language for the currently authenticated user.
	 * @arg {String} language The language in the form of a locale specification (e.g.
	 *     'de_DE.UTF-8')
	 * @returns {Boolean} {@link true} if successful, otherwise {@link false}
	 */
	set_language( language ) {}

	/**
	 * Triggers the system to shutdown.
	 * @returns {Boolean} {@link true} if shutdown initiated, otherwise {@link false}
	 */
	shutdown() {
		return this._do_mocked_system_action('shutdown');
	}

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
	suspend() {
		return this._do_mocked_system_action('suspend');
	}

}





