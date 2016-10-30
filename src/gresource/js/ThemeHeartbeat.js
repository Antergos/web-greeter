/*
 * heartbeat.js
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
 * Singleton class for the greeter theme heartbeat.
 *
 * Once instantiated, the instance will begin sending a heartbeat message to the greeter
 * every 5 seconds. Upon receiving the first heartbeat message, the greeter will schedule checks
 * to ensure that subsequent heartbeat messages are received.
 *
 * If a heartbeat message is not received by the time any of the greeter's
 * subsequent checks run, it will assume that there has been an error in the theme's script
 * execution and fall back to the simple theme.
 */
class ThemeHeartbeat  {

	constructor() {
		if ( '__heartbeat' in window ) {
			return __heartbeat;
		}

		window.__heartbeat = theme_utils.bind_this(this);
		this.heartbeat = '';
		this.heartbeats = 0;

		this.initialize_theme_heartbeat();

		return window.__heartbeat;
	}

	initialize_theme_heartbeat() {
		if ( '' !== this.heartbeat ) {
			console.log( 'Heartbeat has already been initialized!' );
			return;
		}

		console.log('Initializing theme heartbeat.');

		this.send_heartbeat();
		this.heartbeat = setInterval(this.send_heartbeat, 5000);
	}

	send_heartbeat() {
		++this.heartbeats;

		if ( true === lightdm.session_starting ) {
			clearInterval( this.heartbeat );
			return;
		}

		if ( this.heartbeats < 5 ) {
			console.log('Sending heartbeat...');
		}

		window.webkit.messageHandlers.GreeterBridge.postMessage('Heartbeat');
	}
}


new ThemeHeartbeat();
