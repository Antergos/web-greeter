/*
 * WK2Greeter.js
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
 * @memberOf LightDM
 */
class WK2Greeter extends LightDMGreeter {

	constructor( bridge ) {
		if ( 'lightdm' in window ) {
			return window.lightdm;
		}

		super();

		window.lightdm = GreeterUtils.bind_this( this );
		this.bridge = bridge;

		return window.lightdm;
	}

	get authentication_user() {
		return this.bridge.get_string( 'authentication_user' );
	}

	get autologin_guest() {
		return this.bridge.get_bool( 'autologin_guest' );
	}

	get autologin_timeout() {
		return this.bridge.get_num( 'autologin_timeout' );
	}

	get autologin_user() {
		return this.bridge.get_string( 'autologin_user' );
	}

	get can_hibernate() {
		return this.bridge.get_bool( 'can_hibernate' );
	}

	get can_restart() {
		return this.bridge.get_bool( 'can_restart' );
	}

	get can_shutdown() {
		return this.bridge.get_bool( 'can_shutdown' );
	}

	get can_suspend() {
		return this.bridge.get_bool( 'can_suspend' );
	}

	get default_session() {
		return this.bridge.get_string( 'default_session' );
	}

	get has_guest_account() {
		return this.bridge.get_bool( 'has_guest_account' );
	}

	get hide_users() {
		return this.bridge.get_bool( 'hide_users' );
	}

	get hostname() {
		return this.bridge.get_string( 'hostname' );
	}

	get in_authentication() {
		return this.bridge.get_bool( 'in_authentication' );
	}

	get is_authenticated() {
		return this.bridge.get_bool( 'is_authenticated' );
	}

	get language() {
		return this.bridge.get_object( 'language' );
	}

	get languages() {
		return this.bridge.get_objects( 'languages' );
	}

	get layout() {
		return this.bridge.get_object( 'layout' );
	}

	set layout( value ) {
		this._layout = value;
	}

	get layouts() {
		return this.bridge.get_objects( 'layouts' );
	}

	get lock_hint() {
		return this.bridge.get_bool( 'lock_hint' );
	}

	get num_users() {
		return this.users.length;
	}

	get select_guest_hint() {
		return this.bridge.get_bool( 'select_guest_hint' );
	}

	get select_user_hint() {
		return this.bridge.get_string( 'select_user_hint' );
	}

	get sessions() {
		return this.bridge.get_objects( 'sessions' );
	}

	get users() {
		return this.bridge.get_objects( 'users' );
	}

	authenticate( username = null ) {}

	authenticate_as_guest() {}

	cancel_authentication() {}

	cancel_autologin() {}

	get_hint( name ) {}

	hibernate() {
		return this._do_mocked_system_action('hibernate');
	}

	respond( response ) {}

	restart() {
		return this._do_mocked_system_action('restart');
	}

	set_language( language ) {}

	shutdown() {
		return this._do_mocked_system_action('shutdown');
	}

	start_session( session ) {}

	suspend() {
		return this._do_mocked_system_action('suspend');
	}

}


window.WK2Greeter = WK2Greeter;



