/*
 * Copyright © 2015-2016 Antergos
 *
 * mock.js
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

if ('undefined' !== typeof lightdm) {
	throw new Error('Cannot use LightDM Mock while the greeter is running!');
}

/**
 * Interface for accessing info about a session. {@link LightDMSession} objects are not
 * instantiated by the theme's code, but rather by the {@link LightDMGreeter} class.
 */
const LightDMSession = class {

	/**
	 * @private
	 */
	constructor() {
		this._name = '';
		this._key = '';
		this._comment = '';
	}

	/**
	 * The comment for the session.
	 * @type {String}
	 * @readonly
	 */
	get comment() {
		return this._comment;
	}

	/**
	 * The key for the session.
	 * @type {String}
	 * @readonly
	 */
	get key() {
		return this._key;
	}

	/**
	 * The name for the session.
	 * @type {String}
	 * @readonly
	 */
	get name() {
		return this._name;
	}

};


/**
 * Class which implements the LightDMGreeter Interface.
 */
const lightdm = class LightDMGreeter {

	constructor() {
		this._initialize_properties();
	}

	/**
	 * @ignore
	 */
	_initialize_properties() {
		let default_values = {'string': '', 'int': 0, 'bool': false, 'list': [], 'null': null},
			properties = {
				'string': ['authentication_user', 'autologin_user', 'default_session', 'hostname', 'num_users'],
				'int': ['autologin_timeout'],
				'bool': [
					'autologin_guest', 'can_hibernate', 'can_restart', 'can_shutdown', 'can_suspend',
					'has_guest_account', 'hide_users', 'in_authentication', 'is_authenticated',
					'lock_hint', 'select_guest_hint', 'select_user_hint'
				],
				'list': ['languages', 'layouts', 'sessions', 'users'],
				'null': ['language', 'layout']
			};

		for ( let property_type of properties.keys() ) {
			for ( let property of properties[property_type] ) {
				this[`_${property}`] = default_values[property_type];
			}
		}
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

	set layout(value) {
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
		return this._num_users;
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
	hibernate() {}

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

// mock lighdm for testing
if (typeof lightdm == 'undefined') {
	lightdm = {};
	lightdm.hostname = "test-host";
	lightdm.languages = [{
		code: "en_US",
		name: "English(US)",
		territory: "USA"
	}, {
		code: "en_UK",
		name: "English(UK)",
		territory: "UK"
	}];
	lightdm.default_language = lightdm.languages[0];
	lightdm.layouts = [{
		name: "test",
		short_description: "test description",
		short_description: "really long epic description"
	}];
	lightdm.default_layout = lightdm.layouts[0];
	lightdm.layout = lightdm.layouts[0];
	lightdm.sessions = [{
		key: "gnome",
		name: "gnome",
		comment: "no comment"
	}, {
		key: "cinnamon",
		name: "cinnamon",
		comment: "no comment"
	}, {
		key: "openbox",
		name: "openbox",
		comment: "no comment"
	}, {
		key: "key4",
		name: "kde",
		comment: "no comment"
	}];

	lightdm.default_session = lightdm.sessions[0]['name'];
	lightdm.authentication_user = null;
	lightdm.is_authenticated = false;
	lightdm.can_suspend = true;
	lightdm.can_hibernate = true;
	lightdm.can_restart = true;
	lightdm.can_shutdown = true;
	lightdm.awaiting_username = false;

	lightdm.users = [{
		name: "clarkk",
		real_name: "Superman",
		display_name: "Clark Kent",
		image: "",
		language: "en_US",
		layout: null,
		session: "gnome",
		logged_in: false
	}, {
		name: "brucew",
		real_name: "Batman",
		display_name: "Bruce Wayne",
		image: "",
		language: "en_US",
		layout: null,
		session: "cinnamon",
		logged_in: false
	}, {
		name: "peterp",
		real_name: "Spiderman",
		display_name: "Peter Parker",
		image: "",
		language: "en_US",
		layout: null,
		session: "gnome",
		logged_in: true
	}, {
		name: "clarkk2",
		real_name: "Superman",
		display_name: "Clark Kent",
		image: "",
		language: "en_US",
		layout: null,
		session: "gnome",
		logged_in: false
	}, {
		name: "brucew2",
		real_name: "Batman",
		display_name: "Bruce Wayne",
		image: "",
		language: "en_US",
		layout: null,
		session: "cinnamon",
		logged_in: false
	}, {
		name: "peterp2",
		real_name: "Spiderman",
		display_name: "Peter Parker",
		image: "",
		language: "en_US",
		layout: null,
		session: "gnome",
		logged_in: true
	}];

	lightdm.num_users = lightdm.users.length;
	lightdm.timed_login_delay = 0; //set to a number higher than 0 for timed login simulation
	lightdm.timed_login_user = lightdm.timed_login_delay > 0 ? lightdm.users[0] : null;

	lightdm.get_string_property = function () {
	};
	lightdm.get_integer_property = function () {
	};
	lightdm.get_boolean_property = function () {
	};
	lightdm.cancel_timed_login = function () {
		_lightdm_mock_check_argument_length(arguments, 0);
		lightdm._timed_login_cancelled = true;
	};

	lightdm.provide_secret = function (secret) {
		if (typeof lightdm._username == 'undefined' || !lightdm._username) {
			throw "must call start_authentication first"
		}
		_lightdm_mock_check_argument_length(arguments, 1);
		var user = _lightdm_mock_get_user(lightdm.username);

		if (!user && secret == lightdm._username) {
			lightdm.is_authenticated = true;
			lightdm.authentication_user = user;
		} else {
			lightdm.is_authenticated = false;
			lightdm.authentication_user = null;
			lightdm._username = null;
		}
		authentication_complete();
	};

	lightdm.start_authentication = function (username) {
		if ('undefined' === typeof username) {
			show_prompt("Username?", 'text');
			lightdm.awaiting_username = true;
			return;
		}
		_lightdm_mock_check_argument_length(arguments, 1);
		if (lightdm._username) {
			throw "Already authenticating!";
		}
		var user = _lightdm_mock_get_user(username);
		if (!user) {
			show_error(username + " is an invalid user");
		}
		show_prompt("Password: ");
		lightdm._username = username;
	};

	lightdm.cancel_authentication = function () {
		_lightdm_mock_check_argument_length(arguments, 0);
		if (!lightdm._username) {
			console.log("we are not authenticating");
		}
		lightdm._username = null;
	};

	lightdm.suspend = function () {
		alert("System Suspended. Bye Bye");
		document.location.reload(true);
	};

	lightdm.hibernate = function () {
		alert("System Hibernated. Bye Bye");
		document.location.reload(true);
	};

	lightdm.restart = function () {
		alert("System restart. Bye Bye");
		document.location.reload(true);
	};

	lightdm.shutdown = function () {
		alert("System Shutdown. Bye Bye");
		document.location.reload(true);
	};

	lightdm.login = function (user, session) {
		_lightdm_mock_check_argument_length(arguments, 2);
		if (!lightdm.is_authenticated) {
			throw "The system is not authenticated";
		}
		if (user !== lightdm.authentication_user) {
			throw "this user is not authenticated";
		}
		alert("logged in successfully!!");
		document.location.reload(true);
	};
	lightdm.authenticate = function (session) {
		lightdm.login(null, session);
	};
	lightdm.respond = function (response) {
		if (true === lightdm.awaiting_username) {
			lightdm.awaiting_username = false;
			lightdm.start_authentication(response);
		} else {
			lightdm.provide_secret(response);
		}
	};
	lightdm.start_session_sync = function () {
		lightdm.login(null, null);
	};

	if (lightdm.timed_login_delay > 0) {
		setTimeout(function () {
			if (!lightdm._timed_login_cancelled()) {
				timed_login();
			}
		}, lightdm.timed_login_delay);
	}

	var config = {}, greeterutil = {};

	config.get_str = function (section, key) {
		var branding = {
			logo: 'img/antergos.png',
			user_logo: 'ing/antergos-logo-user.png',
			background_images: '/usr/share/antergos/wallpapers'
		};
		if ('branding' === section) {
			return branding[key];
		}
	};
	config.get_bool = function (section, key) {
		return true;
	};


	greeterutil.dirlist = function (directory) {
		if ('/usr/share/antergos/wallpapers' === directory) {
			return ['/usr/share/antergos/wallpapers/83II_by_bo0xVn.jpg', '/usr/share/antergos/wallpapers/antergos-wallpaper.png', '/usr/share/antergos/wallpapers/as_time_goes_by____by_moskanon-d5dgvt8.jpg', '/usr/share/antergos/wallpapers/autumn_hike___plant_details_by_aoiban-d5l7y83.jpg', '/usr/share/antergos/wallpapers/blossom_by_snipes2.jpg', '/usr/share/antergos/wallpapers/c65sk3mshowxrtlljbvh.jpg', '/usr/share/antergos/wallpapers/early_morning_by_kylekc.jpg', '/usr/share/antergos/wallpapers/extinction_by_signcropstealer-d5j4y84.jpg', '/usr/share/antergos/wallpapers/field_by_stevenfields-d59ap2i.jpg', '/usr/share/antergos/wallpapers/Grass_by_masha_darkelf666.jpg', '/usr/share/antergos/wallpapers/Grass_Fullscreen.jpg', '/usr/share/antergos/wallpapers/humble_by_splendidofsun-d5g47hb.jpg', '/usr/share/antergos/wallpapers/In_the_Grass.jpg', '/usr/share/antergos/wallpapers/morning_light.jpg', '/usr/share/antergos/wallpapers/Nautilus_Fullscreen.jpg', '/usr/share/antergos/wallpapers/nikon_d40.jpg', '/usr/share/antergos/wallpapers/sky_full_of_stars.jpg', '/usr/share/antergos/wallpapers/solely_by_stevenfields.jpg', '/usr/share/antergos/wallpapers/the_world_inside_my_lens__by_moskanon-d5fsiqs.jpg', '/usr/share/antergos/wallpapers/white_line_by_snipes2.jpg']
		}
	}
}

function _lightdm_mock_check_argument_length(args, length) {
	if (args.length != length) {
		throw "incorrect number of arguments in function call";
	}
}

function _lightdm_mock_get_user(username) {
	var user = null;
	for (var i = 0; i < lightdm.users.length; ++i) {
		if (lightdm.users[i].name == username) {
			user = lightdm.users[i];
			break;
		}
	}
	return user;
}
