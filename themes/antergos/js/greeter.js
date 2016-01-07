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


/**
 * This is used to access our main class from within jQuery callbacks.
 */
var _self = null;


/**
 * Capitalize a string.
 *
 * @returns {string}
 */
String.prototype.capitalize = function() {
	return this.charAt( 0 ).toUpperCase() + this.slice( 1 );
};


/**
 * This is the theme's main class object. It contains almost all the theme's logic.
 */
class AntergosTheme {

	constructor() {
		if (null !== _self) {
			return _self;
		}
		this.debug = this.cache_get( 'debug', 'enabled' );
		this.user_list_visible = false;
		this.auth_pending = false;
		this.selected_user = null;
		this.$user_list = $( '#user-list2' );
		this.$session_list = $( '#sessions' );
		this.$clock_container = $( '#collapseOne' );
		this.$clock = $( "#current_time" );
		this.$actions_container = $( "#actionsArea" );
		this.$msg_area_container = $( '#statusArea' );
		this.$msg_area = $( '#showMsg' );
		this.lang = window.navigator.language.split( '-' )[ 0 ].toLowerCase();
		this.translations = window.ant_translations;

		this.initialize();
	}

	initialize() {
		this.initialize_clock();
		this.prepare_login_panel_header();
		this.prepare_user_list();
		this.prepare_session_list();
		this.prepare_system_action_buttons();

		this.register_callbacks();
	}

	/**
	 * Add text to the debug log element (accessible from the login screen).
	 *
	 * @param {string} text - To be added to the log.
	 */
	log( text ) {
		if ( 'true' === this.debug || true ) {
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

		for ( var part of key_parts ) {
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

		for ( var part of key_parts ) {
			key += `:${part}`;
			index += 1;
		}
		return localStorage.setItem( key, value );
	}

	/**
	 * Register callbacks for the LDM Greeter as well as any others that haven't been registered
	 * elsewhere.
	 */
	register_callbacks() {
		$( document ).keydown( this.key_press_handler );
		$( '.cancel_auth' ).click( this.cancel_authentication );
		$( '.submit_passwd' ).click( this.submit_password );
		window.show_prompt = this.show_prompt;
		window.show_message = this.show_message;
		window.start_authentication = this.start_authentication;
		window.cancel_authentication = this.cancel_authentication;
		window.authentication_complete = this.authentication_complete;
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
				last_session = localStorage.getItem( user.name );
				if ( null === last_session ) {
					// This user has never logged in before let's enable the system's default
					// session.
					last_session = lightdm.default_session;
				}
				this.cache_set( last_session, 'user', user.name, 'session' );
			}

			this.log( `Last session for ${user.name} was: ${last_session}` );

			template = `
				<a href="#" id="${user.name}" class="list-group-item ${user.name}" data-session="${last_session}">
					<img src="${image_src}" class="img-circle" alt="${user.display_name}" />
					<span>${user.display_name}</span>
					<span class="badge"><i class="fa fa-check"></i></span>
				</a>`;

			// Register event handler here so we don't have to iterate over the users again later.
			$( template ).appendTo( this.$user_list ).click( this.start_authentication ).children( 'img' ).on( 'error', this.image_not_found );

		} // END for ( var user of lightdm.users )

		if ( $( this.$user_list ).children().length > 3 ) {
			// Make the user list two columns instead of one.
			$( this.$user_list ).css( 'column-count', '2' ).parent().css( 'max-width', '85%' );
		}

	}

	/**
	 * Initialize the session selection dropdown.
	 */
	prepare_session_list() {
		// Loop through the array of LightDMSession objects to create our session list.
		for ( var session of lightdm.sessions ) {
			var css_class = session.name.replace( / /g, '' ),
				template;

			this.log( `Adding ${session.name} to the session list...` );

			template = `
				<li>
					<a href="#" data-session-id="${session.key}" class="${css_class}">${session.name}</a>
				</li>`;

			$( template ).appendTo( this.$session_list ).click( this.session_toggle_handler );

		} // END for (var session of lightdm.sessions)

		$( '.dropdown-toggle' ).dropdown();
	}

	/**
	 * Initialize the system action buttons
	 */
	prepare_system_action_buttons() {
		var actions = {
				shutdown: "power-off",
				hibernate: "asterisk",
				suspend: "arrow-down",
				restart: "refresh"
			},
			template;

		for ( var action of Object.keys( actions ) ) {
			var cmd = `can_${action}`;

			template = `
				<a href="#" id="${action}" class="btn btn-default ${action}" data-toggle="tooltip" data-placement="top" title="${action.capitalize()}" data-container="body">
					<i class="fa fa-${actions[ action ]}"></i>
				</a>`;

			if ( lightdm[ cmd ] ) {
				$( template ).appendTo( $( this.$actions_container ) ).click( action, ( event ) => {
					lightdm[ event.data ]();
				} );
			}
		} // END for (var [action, icon] of actions)

		$( '[data-toggle=tooltip]' ).tooltip();
	}

	initialize_clock() {
		var saved_format = this.cache_get( 'clock', 'time_format' ),
			format = (null !== saved_format) ? saved_format : 'LT',
			detected_language = this.lang;
		window.navigator.languages = (typeof window.navigator.languages !== 'undefined') ? window.navigator.languages : [ window.navigator.language ];

		// Workaround for moment.js bug: https://github.com/moment/moment/issues/2856
		for ( var lang of window.navigator.languages ) {
			try {
				detected_language = lang.split( '-' )[ 0 ].toLowerCase();
				break;
			} catch ( err ) {
				this.log( String( err ) );
			}
		}

		if ( null === detected_language ) {
			detected_language = 'en';
		}

		moment.locale( detected_language );
		this.$clock.html( moment().format( format ) );

		setInterval( () => {
			this.$clock.html( moment().format( format ) );
		}, 60000 );
	}


	/**
	 * Show the user list if its not already shown. This is used to allow the user to
	 * display the user list by pressing Enter or Spacebar.
	 */
	show_user_list() {
		if ( $( this.$clock_container ).hasClass( 'in' ) ) {
			$( '#trigger' ).trigger( 'click' );
			this.user_list_visible = true;
		}
		if ( $( this.$user_list ).length <= 1 ) {
			$( this.$user_list ).find( 'a' ).trigger( 'click', this );
		}
	}

	prepare_login_panel_header() {
		var greeting = null;

		if ( this.translations.greeting.hasOwnProperty( this.lang ) ) {
			greeting = this.translations.greeting[ this.lang ];

		} else {

			for ( var lang of window.navigator.languages ) {
				if ( this.translations.greeting.hasOwnProperty( lang ) ) {
					greeting = this.translations.greeting[ lang ];
					break;
				}
			}
		}

		greeting = (null === greeting) ? 'Welcome!' : greeting;

		$( '.welcome' ).text( greeting );
		$( '#hostname' ).append( lightdm.hostname );
	}


	/**
	 * Start the authentication process for the selected user.
	 *
	 * @param {object} event - jQuery.Event object from 'click' event.
	 */
	start_authentication( event ) {
		var user_id = $( this ).attr( 'id' ),
			selector = `.${user_id}`,
			user_session = _self.cache_get( 'user', user_id, 'session' );

		if ( _self.auth_pending || null !== _self.selected_user ) {
			lightdm.cancel_authentication();
			_self.log( `Authentication cancelled for ${_self.selected_user}` );
			_self.selected_user = null;
		}

		_self.log( `Starting authentication for ${user_id}.` );
		_self.selected_user = user_id;

		// CSS hack to workaround webkit bug
		if ( $( _self.$user_list ).children().length > 3 ) {
			$( _self.$user_list ).css( 'column-count', 'initial' ).parent().css( 'max-width', '50%' );
		}
		$( selector ).addClass( 'hovered' ).siblings().hide();
		$( '.fa-toggle-down' ).hide();

		_self.log( `Session for ${user_id} is ${user_session}` );

		$( `[data-session-id="${user_session}"]` ).parent().trigger( 'click', this );

		$( '#session-list' ).removeClass( 'hidden' ).show();
		$( '#passwordArea' ).show();
		$( '.dropdown-toggle' ).dropdown();

		_self.auth_pending = true;

		lightdm.start_authentication( user_id );
	}


	/**
	 * Cancel the pending authentication.
	 *
	 * @param {object} event - jQuery.Event object from 'click' event.
	 */
	cancel_authentication( event ) {
		var selectors = [ '#statusArea', '#timerArea', '#passwordArea', '#session-list' ];

		for ( var selector of selectors ) {
			$( selector ).hide();
		}

		lightdm.cancel_authentication();

		_self.log( 'Cancelled authentication.' );

		// CSS hack to work-around webkit bug
		if ( $( _self.$user_list ).children().length > 3 ) {
			$( _self.$user_list ).css( 'column-count', '2' ).parent().css( 'max-width', '85%' );
		}

		$( '.hovered' ).removeClass( 'hovered' ).siblings().show();
		$( '.fa-toggle-down' ).show();

		_self.selected_user = null;
		_self.auth_pending = false;

	}


	/**
	 * Called when the user attempts to authenticate (inputs password).
	 * We check to see if the user successfully authenticated and if so tell the LDM
	 * Greeter to log them in with the session they selected.
	 */
	authentication_complete() {
		var selected_session = $( '.selected' ).attr( 'data-session-id' ),
			err_msg = this.translations.auth_failed[ this.lang ];

		_self.auth_pending = false;
		_self.cache_set( selected_session, 'user', lightdm.authentication_user, 'session' );

		$( '#timerArea' ).hide();

		if ( lightdm.is_authenticated ) {
			// The user entered the correct password. Let's log them in.
			lightdm.login( lightdm.authentication_user, selected_session );
		} else {
			// The user did not enter the correct password. Show error message.

			$( '#statusArea' ).show();
		}
	}

	submit_password( event ) {
		lightdm.provide_secret( $( '#passwordField' ).val() );
		$( '#passwordArea' ).hide();
		$( '#timerArea' ).show();
	}

	session_toggle_handler( event ) {
		var $session = $( this ).children( 'a' ),
			session_name = $session.text(),
			session_key = $session.attr( 'data-session-id' );

		$session.parents( '.btn-group' ).find( '.selected' ).attr( 'data-session-id', session_key ).html( session_name );
	}

	key_press_handler( event ) {
		var action;
		switch ( event.which ) {
			case 13:
				action = _self.auth_pending ? _self.submit_password() : ! _self.user_list_visible ? _self.show_user_list() : 0;
				_self.log( action );
				break;
			case 27:
				action = _self.auth_pending ? _self.cancel_authentication() : 0;
				_self.log( action );
				break;
			case 32:
				action = (! _self.user_list_visible && ! _self.auth_pending) ? _self.show_user_list() : 0;
				_self.log( action );
				break;
			default:
				break;
		}
	}

	/**
	 * User image on('error') handler.
	 */
	image_not_found( source ) {
		source.onerror = "";
		source.src = 'img/antergos-logo-user.png';
		return true;
	}

	/**
	 * LightDM Callback - Show password prompt to user.
	 *
	 * @param text
	 */
	show_prompt( text ) {

		$( '#passwordField' ).val( "" );
		$( '#passwordArea' ).show();
		$( '#passwordField' ).focus();
	}

	/**
	 * LightDM Callback - Show message to user.
	 *
	 * @param msg
	 */
	show_message( msg ) {
		if ( msg.length > 0 ) {
			$( this.$msg_area ).html( msg );
			$( '#passwordArea' ).hide();
			$( this.$msg_area_container ).show();
		}
	}
}


/**
 * Initialize the theme once the window has loaded.
 */
$( window ).load( () => {
	_self = new AntergosTheme();
} );

