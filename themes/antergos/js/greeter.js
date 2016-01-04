/*
 *
 * Copyright © 2015-2016 Antergos
 *
 * greeter.js
 *
 * This file is part of lightdm-webkit-theme-antergos
 *
 * lightdm-webkit-theme-antergos is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * lightdm-webkit-theme-antergos is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of this license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var DEBUG = true,
	selectedUser = null,
	authPending = null,
	users_shown = null,
	userList;


class AntergosTheme {
	constructor() {
		this.debug = this.cache_get( 'debug', 'enabled' );
		this.user_list_visible = false;
		this.$user_list = $( '#user-list2' );
		this.$session_list = $( '#sessions' );
		this.$clock_container = $( '#collapseOne' );
		this.lang = window.navigator.language;
		this.initialize();
		//this.register_events();
	}

	initialize() {
		this.initialize_clock();
		this.prepare_user_list();
		this.prepare_session_list();
		//this.maybe_create_thumbnails();
		//this.prepare_session_list();
		//this.prepare_system_actions();
	}

	/**
	 * Add text to the debug log element (accessible from the login screen).
	 *
	 * @param {string} text - To be added to the log.
	 */
	log( text ) {
		if ( 'true' === this.debug ) {
			$( '#logArea' ).append( `${text}<br/>` );
		}
	}

	/**
	 * Get a key's value from localStorage. Keys can have two or more parts.
	 * For example: "ant:user:john:session".
	 *
	 * @param {...string} key_parts - Strings that are combined to form the key.
	 */
	cache_get( ...key_parts ) {
		var key = `ant`,
			index = 0;

		for (part of key_parts) {
			key += `:${part}`;
			index += 1;
		}
		return localStorage.getItem( key );
	}

	/**
	 * Set a key's value in localStorage. Keys can have two or more parts.
	 * For example: "ant:user:john:session".
	 *
	 * @param {string} value - The value to set.
	 * @param {...string} key_parts - Strings that are combined to form the key.
	 */
	cache_set( value, ...key_parts ) {
		var key = `ant`,
			index = 0;

		for ( part of key_parts ) {
			key += `:${part}`;
			index += 1;
		}
		return localStorage.setItem( key, value );
	}

	/**
	 * Initialize the user list.
	 */
	prepare_user_list() {
		var tux = 'img/antergos-logo-user.png',
			template;

		// Loop through the array of LightDMUser objects to create our user list.
		for ( var user of lightdm.users ) {
			var last_session = this.cache_get( 'user', user.name, 'session' ),
				image_src = user.image.length ? user.image : tux;

			if ( null === last_session ) {
				// For backwards compatibility
				last_session = localStorage.getItem(user.name);
				if ( null === last_session ) {
					// This user has never logged in before let's enable the system's default session.
					last_session = lightdm.default_session;
				}
				this.cache_set( last_session, 'user', user.name, 'session' );
			}

			this.log( `Last session for ${user.name} was: ${last_session}` );

			template = `
				<a href="#${user.name}" class="list-group-item ${user.name}" data-session="${last_session}">
					<img src="${image_src}" class="img-circle" alt="${user.display_name}" />
					<span>${user.display_name}</span>
					<span class="badge"><i class="fa fa-check"></i></span>
				</a>`;

			// Register event handler here so we don't have to iterate over the users again later.
			$( template ).appendTo( this.$user_list ).click( this.start_authentication ).children( 'img' ).on( 'error', this.image_not_found );

		} // END for ( var user of lightdm.users )

		if ( $( $user_list ).children().length > 3 ) {
			// Make the user list two columns instead of one.
			$( $user_list ).css( 'column-count', '2' );
			$( $user_list ).parent().css( 'max-width', '85%' );
		}

	}

	/**
	 * Initialize the session selection dropdown.
	 */
	prepare_session_list() {
		// Loop through the array of LightDMSession objects to create our session list.
		for (var session of lightdm.sessions) {
			var css_class = session.name.replace(/ /g, ''),
				template;

			this.log(`Adding ${session.name} to the session list...`);

			template = `
				<li>
					<a href="#" data-session-id="${session.key}" class="${css_class}">${session.name}</a>
				</li>`;

			$(template).appendTo(this.$session_list).click(this.session_toggle_handler);

		} // END for (var session of lightdm.sessions)

		$( '.dropdown-toggle' ).dropdown();
	}

	initialize_clock() {
		this.update_clock();
		setInterval( this.update_clock, 60000 );
	}

	session_toggle_handler(event) {
		var session = event.target,
			session_name = $( session ).text(),
			session_key = $( session ).attr( 'data-session-id' ),
			selected_user = this.cache_get( 'misc', 'selected_user' );

		$( session ).parents( '.btn-group' ).find( '.selected' ).attr( 'data-session-id', session_key ).html(session_name);
	}

	show_user_list() {
		if ( $(this.$clock_container).hasClass( 'in' ) ) {
			$( '#trigger' ).trigger( 'click' );
			this.user_list_visible = true;
		}
		if ( $(this.$user_list).length <= 1 ) {
			$(this.$user_list).find('a').trigger( 'click' );
		}
	}

	image_not_found() {

	}

	start_authentication() {

	}
}



$(document).ready(function() {


	$(window).load(function() {

		/**
		 * UI Initialization.
		 */


		initialize_timer();
		get_hostname();

		theme = new AntergosTheme();
		buildSessionList();
		// Password submit when enter key is pressed

		$(document).keydown(function(e) {
			checkKey(e);
		});
		// Action buttons
		addActionLink("shutdown");
		addActionLink("hibernate");
		addActionLink("suspend");
		addActionLink("restart");
	});

	function get_hostname() {
		var hostname = lightdm.hostname;
		var hostname_span = document.getElementById('hostname');
		$(hostname_span).append(hostname);
	}

	/**
	 * Actions management.
	 *
	 *
	 */

	function update_time() {
		var time = document.getElementById("current_time");
		var date = new Date();
		var twelveHr = [
			'sq-al',
			'zh-cn',
			'zh-tw',
			'en-au',
			'en-bz',
			'en-ca',
			'en-cb',
			'en-jm',
			'en-ng',
			'en-nz',
			'en-ph',
			'en-us',
			'en-tt',
			'en-zw',
			'es-us',
			'es-mx'];
		var userLang = window.navigator.language;
		var is_twelveHr = twelveHr.indexOf(userLang);
		var hh = date.getHours();
		var mm = date.getMinutes();
		var suffix = "AM";
		if (hh >= 12) {
			suffix = "PM";
			if (is_twelveHr !== -1 && is_twelveHr !== 12) {
				hh = hh - 12;
			}
		}
		if (mm < 10) {
			mm = "0" + mm;
		}
		if (hh === 0 && is_twelveHr !== -1) {
			hh = 12;
		}
		time.innerHTML = hh + ":" + mm + " " + suffix;
	}

	function initialize_timer() {
		var userLang = window.navigator.language;

		update_time();
		setInterval(update_time, 60000);
	}

	function checkKey(event) {
		var action;
		switch (event.which) {
			case 13:
				action = authPending ? submitPassword() : !users_shown ? show_users() : 0;
				log(action);
				break;
			case 27:
				action = authPending ? cancelAuthentication() : 0;
				log(action);
				break;
			case 32:
				action = !users_shown && !authPending ? show_users() : 0;
				log(action);
				break;
			default:
				break;
		}
	}

	function addActionLink(id) {
		if (eval("lightdm.can_" + id)) {
			var label = id.substr(0, 1).toUpperCase() + id.substr(1, id.length - 1);
			var id2;
			if (id == "shutdown") {
				id2 = "power-off"
			}
			if (id == "hibernate") {
				id2 = "asterisk"
			}
			if (id == "suspend") {
				id2 = "arrow-down"
			}
			if (id == "restart") {
				id2 = "refresh"
			}
			$("#actionsArea").append('\n<button type="button" class="btn btn-default ' + id + '" data-toggle="tooltip" data-placement="top" title="' + label + '" data-container="body" onclick="handleAction(\'' + id + '\')"><i class="fa fa-' + id2 + '"></i></button>');
		}
	}

	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	window.handleAction = function(id) {
		eval("lightdm." + id + "()");
	};

	function getUserObj(username) {
		var user = null;
		for (var i = 0; i < lightdm.users.length; ++i) {
			if (lightdm.users[i].name == username) {
				user = lightdm.users[i];
				break;
			}
		}
		return user;
	}

	function getSessionObj(sessionname) {
		var session = null;
		for (var i = 0; i < lightdm.sessions.length; ++i) {
			if (lightdm.sessions[i].name == sessionname) {
				session = lightdm.sessions[i];
				break;
			}
		}
		return session;
	}


	window.startAuthentication = function(userId) {
		log("startAuthentication(" + userId + ")");

		if (selectedUser !== null) {
			lightdm.cancel_authentication();
			localStorage.setItem('selUser', null);
			log("authentication cancelled for " + selectedUser);
		}
		localStorage.setItem('selUser', userId);
		selectedUser = '.' + userId;
		$(selectedUser).addClass('hovered');
		console.log(userList);
		if ($(userList).children().length > 3) {
			$(userList).css('column-count', 'initial');
			$(userList).parent().css('max-width', '50%');
		}
		$(selectedUser).siblings().hide();
		$('.fa-toggle-down').hide();


		var usrSession = localStorage.getItem(userId);
		if (! usrSession) {
			var user_session = lightdm.get_user_session(userId);
			usrSession = user_session ? user_session : lightdm.get_default_session();
			localStorage.setItem(userId, usrSession);
		}

		log("usrSession: " + usrSession);

		var usrSessionEl = "[data-session-id=" + usrSession + "]";
		var usrSessionName = $(usrSessionEl).html();

		$('.selected').html(usrSessionName);
		$('.selected').attr('data-session-id', usrSession);
		$('#session-list').removeClass('hidden');
		$('#session-list').show();
		$('#passwordArea').show();
		$('.dropdown-toggle').dropdown();
		authPending = true;

		lightdm.start_authentication(userId);
	};

	window.cancelAuthentication = function() {
		$('#statusArea').hide();
		$('#timerArea').hide();
		$('#passwordArea').hide();
		$('#session-list').hide();
		lightdm.cancel_authentication();

		if ($(userList).children().length > 3) {
			$(userList).css('column-count', '2');
			$(userList).parent().css('max-width', '85%');
		}
		$('.list-group-item').removeClass('hovered').siblings().show();
		$('.fa-toggle-down').show();
		selectedUser = null;
		authPending = false;
		return true;
	};

	window.submitPassword = function() {

		lightdm.provide_secret($('#passwordField').val());
		$('#passwordArea').hide();
		$('#timerArea').show();

	};

	/**
	 * Image loading management.
	 */

	window.imgNotFound = function(source) {
		source.src = 'img/antergos-logo-user.png';
		source.onerror = "";
		return true;
	};

	window.sessionToggle = function(el) {
		var selText = $(el).text();
		var theID = $(el).attr('data-session-id');
		var selUser = localStorage.getItem('selUser');
		$(el).parents('.btn-group').find('.selected').attr('data-session-id', theID);
		$(el).parents('.btn-group').find('.selected').html(selText);
		localStorage.setItem(selUser, theID)
	};
});

/**
 * Lightdm Callbacks
 */
function show_prompt(text) {

	$('#passwordField').val("");
	$('#passwordArea').show();
	$('#passwordField').focus();
}

function authentication_complete() {

	authPending = false;
	$('#timerArea').hide();
	var selSession = $('.selected').attr('data-session-id');
	if (lightdm.is_authenticated) {

		lightdm.login(lightdm.authentication_user, selSession);
	} else {

		$('#statusArea').show();
	}
}

function show_message(text) {
	var msgWrap = document.getElementById('statusArea'),
		showMsg = document.getElementById('showMsg');
	showMsg.innerHTML = text;
	if (text.length > 0) {
		$('#passwordArea').hide();
		$(msgWrap).show();
	}
}

function show_error(text) {
	show_message(text);
}
