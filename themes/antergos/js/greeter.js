/*
 * greeter.js
 *
 * Copyright © 2015-2016 Antergos
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
 * This is used to access our classes from within jQuery callbacks.
 */
var _self = null,
	_bg_self = null,
	_util = null;


/**
 * Capitalize a string.
 *
 * @returns {string}
 */
String.prototype.capitalize = function() {
	return this.charAt( 0 ).toUpperCase() + this.slice( 1 );
};



/**
 * This should be the base class for all the theme's components. However, webkit's
 * support of extending (subclassing) ES6 classes is not stable enough to use.
 * For now we simply bind this class to a global variable for use in our other classes.
 */
class AntergosThemeUtils {

	constructor() {
		if ( null !== _util ) {
			return _util;
		}
		_util = this;

		this.debug = false;
		this.lang = window.navigator.language.split( '-' )[ 0 ].toLowerCase();
		this.translations = window.ant_translations;
		this.$log_container = $('#logArea');
		this.recursion = 0;
		this.cache_backend = '';

		this.setup_cache_backend();
		this.init_config_values();

		return _util;
	}

	setup_cache_backend() {
		// Do we have access to localStorage?
		try {
			localStorage.setItem('testing', 'test');
			let test = localStorage.getItem('testing');

			if ('test' === test) {
				// We have access to localStorage
				this.cache_backend = 'localStorage';
			}
			localStorage.removeItem('testing');

		} catch(err) {
			// We do not have access to localStorage. Fallback to cookies.
			this.log(err);
			this.log('INFO: localStorage is not available. Using cookies for cache backend.');
			this.cache_backend = 'Cookies';
		}

		// Just in case...
		if ('' === this.cache_backend) {
			this.cache_backend = 'Cookies';
		}

		this.log(`AntergosThemeUtils.cache_backend is: ${this.cache_backend}`);
	}


	/**
	 * Add text to the debug log element (accessible from the login screen).
	 *
	 * @param {string} text - To be added to the log.
	 */
	log( text ) {
		if ( true === this.debug ) {
			console.log( text );
		}
		$( '#logArea' ).append( `${text}<br/>` );
	}


	/**
	 * Get a key's value from localStorage. Keys can have two or more parts.
	 * For example: "ant:user:john:session".
	 *
	 * @param {...string} key_parts - Strings that are combined to form the key.
	 */
	cache_get() {
		var key = `ant`, value;

		for (var _len = arguments.length, key_parts = new Array(_len), _key = 0; _key < _len; _key++) {
			key_parts[_key] = arguments[_key];
		}

		for ( var part of key_parts ) {
			key += `:${part}`;
		}

		this.log(`cache_get() called with key: ${key}`);

		if ('localStorage' === this.cache_backend) {
			value = localStorage.getItem(key);
		} else if ('Cookies' === this.cache_backend) {
			value = Cookies.get(key);
		} else {
			value = null;
		}

		if (null !== value) {
			this.log(`cache_get() key: ${key} value is: ${value}`);
		}

		return ('undefined' !== typeof(value)) ? value : null;
	}


	/**
	 * Set a key's value in localStorage. Keys can have two or more parts.
	 * For example: "ant:user:john:session".
	 *
	 * @param {string} value - The value to set.
	 * @param {...string} key_parts - Strings that are combined to form the key.
	 */
	cache_set( value ) {
		var key = `ant`, res;

		for (var _len2 = arguments.length, key_parts = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			key_parts[_key2 - 1] = arguments[_key2];
		}

		for ( var part of key_parts ) {
			key += `:${part}`;
		}
		this.log(`cache_set() called with key: ${key} and value: ${value}`);

		if ('localStorage' === this.cache_backend) {
			res = localStorage.setItem( key, value );
		} else if ('Cookies' === this.cache_backend) {
			res = Cookies.set(key, value);
		} else {
			res = null;
		}

		return res;
	}


	/**
	 * Get some values from `lightdm-webkit2-greeter.conf` and save them for later.
	 */
	init_config_values() {
		var logo, user_image, debug, background_images, background_images_dir;

		if ( 'undefined' !== typeof( config ) ) {

			logo = config.get_str( 'branding', 'logo' ) || 'img/antergos.png';
			user_image = config.get_str( 'branding', 'user_image' ) || 'img/antergos-logo-user.png';
			background_images_dir = config.get_str( 'branding', 'background_images' ) || '/usr/share/backgrounds';
			debug = config.get_bool( 'greeter', 'debug_mode' ) || false;

			if ( background_images_dir ) {
				background_images = greeterutil.dirlist( background_images_dir ) || [];
				_util.log(background_images);
			}

			if ( background_images && background_images.length ) {
				background_images = this.find_images( background_images );
			}

		}

		this.logo = logo;
		this.debug = debug;
		this.user_image = user_image;
		this.background_images = background_images;
		this.background_images_dir = background_images_dir;
	}

	is_not_empty( value ) {
		let empty_values = [null, 'null', undefined, 'undefined'];
		return empty_values.findIndex(v => v === value) === -1;
	}


	find_images( dirlist ) {
		var images = [],
			subdirs = [];

		for ( var file of dirlist ) {
			if ( file.match( /(png|PNG)|(jpg|JPEG)|(bmp|BMP)/ ) ) {
				images.push( file );
			} else if ( ! file.match( /\w+\.\w+/ ) ) {
				subdirs.push( file )
			}
		}

		if ( subdirs.length && ! images.length && this.recursion < 3 ) {
			this.recursion++;
			for ( var dir of subdirs ) {
				var list = greeterutil.dirlist( dir );

				if ( list && list.length ) {
					images.push.apply( images, this.find_images( list ) );
				}
			}
		}

		return images;
	}
}





/**
 * This class handles the theme's background switcher.
 */
class AntergosBackgroundManager {

	constructor() {
		if ( null !== _bg_self ) {
			return _bg_self;
		}

		_bg_self = this;

		this.current_background = _util.cache_get( 'background_manager', 'current_background' );

		if ( ! _util.background_images_dir || ! _util.background_images || ! _util.background_images.length ) {
			_util.log( 'AntergosBackgroundManager: [ERROR] No background images detected.' );

			$( '.header' ).fadeTo( 300, 0.5, function() {
				$( '.header' ).css( "background-image", 'url(img/fallback_bg.jpg)' );
			} ).fadeTo( 300, 1 );

		}

		return _bg_self;
	}


	/**
	 * Determine which background image should be displayed and apply it.
	 */
	initialize( deferred ) {
		if ( ! _bg_self.current_background && 'localStorage' === _util.cache_backend ) {
			// For backwards compatibility
			if ( null !== localStorage.getItem( 'bgsaved' ) && '0' === localStorage.getItem( 'bgrandom' ) ) {
				_bg_self.current_background = localStorage.getItem( 'bgsaved' );
				_util.cache_set( _bg_self.current_background, 'background_manager', 'current_background' );
				localStorage.removeItem( 'bgrandom' );
				localStorage.removeItem( 'bgsaved' );
			} else {
				if ( '1' === localStorage.getItem( 'bgrandom' ) ) {
					_bg_self.current_background = _bg_self.get_random_image();
					_util.cache_set( 'true', 'background_manager', 'random_background' );
					localStorage.removeItem( 'bgrandom' );
				}
			}
		}

		if ( ! _bg_self.current_background ) {
			// For current and future versions
			let current_background = _util.cache_get( 'background_manager', 'current_background' ),
				random_background = _util.cache_get( 'background_manager', 'random_background' );

			if ( 'true' === random_background || ! current_background ) {
				current_background = _bg_self.get_random_image();
				_util.cache_set( 'true', 'background_manager', 'random_background' );
			}

			_bg_self.current_background = current_background;
			_util.cache_set( _bg_self.current_background, 'background_manager', 'current_background' );
		}

		_bg_self.do_background(deferred);
	}


	/**
	 * Set the background image to the value of `this.current_background`
	 */
	do_background( deferred = null ) {
		let bg = _bg_self.current_background,
			tpl = (bg.indexOf('url(') > -1) ? bg : `url(${_bg_self.current_background})`;

		$( '.header' ).css( "background-image", tpl );

		if (null !== deferred) {
			deferred.resolve();
		}
	}


	/**
	 * Get a random background image from our images array.
	 *
	 * @returns str The absolute path to a background image.
	 */
	get_random_image() {
		var random_bg;

		random_bg = Math.floor( Math.random() * _util.background_images.length );

		return _util.background_images[ random_bg ];
	}


	/**
	 * Setup the background switcher widget.
	 */
	setup_background_thumbnails() {
		if ( _util.background_images && _util.background_images.length ) {
			var old_bg_tpl = `url(${this.current_background})`;

			/* TODO: Implement some form of pagination
			 */
			if ( _util.background_images.length > 20 ) {
				_util.background_images = _util.background_images.splice(0, 20);
			}

			$('[data-img="random"]').click(this.background_selected_handler);

			for ( var image_file of _util.background_images ) {
				var $link = $( '<a href="#"><div>' ),
					$img_el = $link.children( 'div' ),
					img_url_tpl = `url(file://${image_file})`;

				$link.addClass( 'bg clearfix' ).attr( 'data-img', img_url_tpl );

				if ( image_file === this.current_background || image_file === old_bg_tpl ) {
					var is_random = _util.cache_get( 'background_manager', 'random_background' );
					if ('true' !== is_random ) {
						$link.addClass( 'active' );
					} else if ( 'true' === is_random ) {
						$('[data-img="random"]').addClass('active');
					}
				}

				$img_el.css( 'background-image', img_url_tpl );

				$link.appendTo( $( '.bgs' ) ).click( this.background_selected_handler );
			}

			if ( ! $('.bg.active').length ) {
				$('[data-img="random"]').addClass('active');
			}
		}
	}


	/**
	 * Handle background image selected event.
	 *
	 * @param event jQuery event object.
	 */
	background_selected_handler( event ) {
		var img = $( this ).attr( 'data-img' );

		$('.bg.active').removeClass('active');
		$(this).addClass('active');

		if ( 'random' === img ) {
			_util.cache_set( 'true', 'background_manager', 'random_background' );
			img = _bg_self.get_random_image();
		} else {
			_util.cache_set( 'false', 'background_manager', 'random_background' );
		}

		_util.cache_set( img, 'background_manager', 'current_background' );
		_bg_self.current_background = img;

		_bg_self.do_background();

	}
}





/**
 * This is the theme's main class object. It contains most of the theme's logic.
 */
class AntergosTheme {

	constructor() {
		if ( null !== _self ) {
			return _self;
		}
		_self = this;

		this.tux = 'img/antergos-logo-user.png';
		this.user_list_visible = false;
		this.auth_pending = false;
		this.selected_user = null;
		this.$user_list = $( '#user-list2' );
		this.$session_list = $( '#sessions' );
		this.$clock_container = $( '#collapseOne' );
		this.$clock = $( '#current_time' );
		this.$actions_container = $( '#actionsArea' );
		this.$msg_area_container = $( '#statusArea' );
		this.$alert_msg_tpl = this.$msg_area_container.children('.alert-dismissible').clone();

		this.background_manager = new AntergosBackgroundManager();

		let init_bg = $.Deferred(this.background_manager.initialize);

		init_bg.then(() => this.initialize());

		return _self;
	}


	/**
	 * Initialize the theme.
	 */
	initialize() {
		this.prepare_translations();
		this.do_static_translations();
		this.initialize_clock();
		this.prepare_login_panel_header();
		this.prepare_system_action_buttons();

		$('#login').css('opacity', '1');

		this.prepare_user_list();
		this.prepare_session_list();
		this.register_callbacks();
		this.background_manager.setup_background_thumbnails();
	}


	/**
	 * Register callbacks for the LDM Greeter as well as any others that haven't
	 * been registered elsewhere.
	 */
	register_callbacks() {
		this.$user_list.parents( '.collapse' ).on( 'shown.bs.collapse', this.user_list_collapse_handler );
		this.$user_list.parents( '.collapse' ).on( ' hidden.bs.collapse', this.user_list_collapse_handler );
		$( document ).keydown( this.key_press_handler );
		$( '.cancel_auth:not(.alert .cancel_auth)' ).on('click', this.cancel_authentication );
		$( '.submit_passwd' ).on('click', this.submit_password );
		$('[data-i18n="debug_log"]').on('click', this.show_log_handler );

		window.show_prompt = this.show_prompt;
		window.show_message = this.show_message;
		window.start_authentication = this.start_authentication;
		window.cancel_authentication = this.cancel_authentication;
		window.authentication_complete = this.authentication_complete;
		window.autologin_timer_expired = this.cancel_authentication;
	}

	/**
	 * Initialize the user list.
	 */
	prepare_user_list() {
		var template;

		// Loop through the array of LightDMUser objects to create our user list.
		for ( var user of lightdm.users ) {
			var last_session = _util.cache_get( 'user', user.name, 'session' ),
				image_src = ( user.hasOwnProperty('image') && user.image && user.image.length ) ? user.image : _util.user_image;

			if ( null === last_session ) {
				// For backwards compatibility
				if ('localStorage' === _util.cache_backend) {
					last_session = localStorage.getItem( user.name );
				}
				if ( null === last_session ) {
					// This user has never logged in before let's enable the system's default
					// session.
					last_session = lightdm.default_session;
				}
				_util.cache_set( last_session, 'user', user.name, 'session' );
			}

			_util.log( `Last session for ${user.name} was: ${last_session}` );

			template = `
				<a href="#" id="${user.name}" class="list-group-item ${user.name}" data-session="${last_session}">
					<img src="${image_src}" class="img-circle" alt="${user.display_name}" />
					<span>${user.display_name}</span>
					<span class="badge"><i class="fa fa-check"></i></span>
				</a>`;

			// Register event handler here so we don't have to iterate over the users again later.
			$( template ).appendTo( this.$user_list ).click( this.start_authentication ).on( 'error.antergos', this.user_image_error_handler );

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

			_util.log( `Adding ${session.name} to the session list...` );

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

			if ( true === lightdm[ cmd ] ) {
				$( template ).appendTo( $( this.$actions_container ) ).click( this.system_action_handler );
			}
		} // END for (var [action, icon] of actions)

		$( '[data-toggle=tooltip]' ).tooltip();
		$( '.modal' ).modal( { show: false } );
	}



	/**
	 * Setup the clock widget.
	 */
	initialize_clock() {
		this.$clock.html( theme_utils.get_current_localized_time() );

		setInterval( () => {
			_self.$clock.html( theme_utils.get_current_localized_time() );
		}, 60000 );
	}


	/**
	 * Show the user list if its not already shown. This is used to allow the user to
	 * display the user list by pressing Enter or Spacebar.
	 */
	show_user_list( shown = false ) {
		let delay = 0;

		if ( _self.$clock_container.hasClass( 'in' ) ) {
			$( '#trigger' ).trigger( 'click' );
			delay = 500;
		} else if ( false === shown ) {
			return;
		}

		if ( _self.$user_list.children().length <= 1 ) {
			setTimeout(() => {
				_self.$user_list.find( 'a' ).trigger( 'click', _self );
			}, delay);
		}
	}


	prepare_login_panel_header() {
		var greeting = (_util.translations.greeting) ? _util.translations.greeting : 'Welcome!',
			logo = ( '' !== _util.logo ) ? _util.logo : 'img/antergos.png';

		$( '.welcome' ).text( greeting );
		$( '#hostname' ).append( lightdm.hostname );
		$( '[data-greeter-config="logo"]' ).attr( 'src', logo );
	}


	prepare_translations() {
		if ( ! _util.translations.hasOwnProperty( this.lang ) ) {
			for ( var lang of window.navigator.languages ) {
				if ( _util.translations.hasOwnProperty( lang ) ) {
					this.lang = lang;
					break;
				}
			}
		}
		if ( ! _util.translations.hasOwnProperty( this.lang ) ) {
			this.lang = 'en';
		}

		_util.translations = _util.translations[ this.lang ];
	}


	/**
	 * Replace '${i18n}' with translated string for all elements that
	 * have the data-i18n attribute. This is for elements that are not generated
	 * dynamically (they can be found in index.html).
	 */
	do_static_translations() {
		$( '[data-i18n]' ).each( function() {
			var key = $( this ).attr( 'data-i18n' ),
				html = $( this ).html(),
				translated = _util.translations[ key ],
				new_html = html.replace( '${i18n}', translated );

			$( this ).html( new_html );
		} );
	}


	/**
	 * Start the authentication process for the selected user.
	 *
	 * @param {object} event - jQuery.Event object from 'click' event.
	 */
	start_authentication( event ) {
		var user_id = $( this ).attr( 'id' ),
			selector = `.${user_id}`,
			user_session_cached = _util.cache_get( 'user', user_id, 'session' ),
			user_session = (_util.is_not_empty( user_session_cached )) ? user_session_cached : lightdm.default_session;

		if ( _self.auth_pending || null !== _self.selected_user ) {
			lightdm.cancel_authentication();
			_util.log( `Authentication cancelled for ${_self.selected_user}` );
			_self.selected_user = null;
		}

		_util.log( `Starting authentication for ${user_id}.` );
		_self.selected_user = user_id;

		if ( $( _self.$user_list ).children().length > 3 ) {
			// Reset columns since only the selected user is visible right now.
			$( _self.$user_list ).css( 'column-count', 'initial' ).parent().css( 'max-width', '50%' );
		}
		$( selector ).addClass( 'hovered' ).siblings().hide();
		$( '.fa-toggle-down' ).hide();

		_util.log( `Session for ${user_id} is ${user_session}` );

		$( `[data-session-id="${user_session}"]` ).parent().trigger( 'click', this );

		$( '#session-list' ).removeClass( 'hidden' ).show();
		$( '#passwordArea' ).show();
		$( '.dropdown-toggle' ).dropdown();

		_self.auth_pending = true;

		lightdm.authenticate( user_id );
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

		_util.log( 'Cancelled authentication.' );

		_self.selected_user = null;
		_self.auth_pending = false;

		if ( $(event.target).hasClass('alert') ) {
			/* We were triggered by the authentication failed message being dismissed.
			 * Keep the same account selected so user can retry without re-selecting an account.
			 */
			$( '#collapseTwo .user-wrap2' ).show(() => {
				$( '.list-group-item.hovered' ).trigger('click');
			});
		} else {
			if ( $( _self.$user_list ).children().length > 3 ) {
				// Make the user list two columns instead of one.
				$( _self.$user_list ).css( 'column-count', '2' ).parent().css( 'max-width', '85%' );
			}

			$( '.hovered' ).removeClass( 'hovered' ).siblings().show();
			$( '.fa-toggle-down' ).show();
		}

	}


	/**
	 * Called when the user attempts to authenticate (submits password).
	 * We check to see if the user successfully authenticated and if so tell the LDM
	 * Greeter to log them in with the session they selected.
	 */
	authentication_complete() {
		var selected_session = $( '.selected' ).attr( 'data-session-id' ),
			err_msg = _util.translations.auth_failed;

		_self.auth_pending = false;
		_util.cache_set( selected_session, 'user', lightdm.authentication_user, 'session' );

		$( '#timerArea' ).hide();

		if ( lightdm.is_authenticated ) {
			// The user entered the correct password. Let's log them in.
			$( 'body' ).fadeOut( 1000, () => {
				lightdm.login( lightdm.authentication_user, selected_session );
			} );
		} else {
			// The user did not enter the correct password. Show error message.
			_self.show_message(err_msg, 'error');
		}
	}


	submit_password( event ) {
		let passwd =  $( '#passwordField' ).val();

		$( '#passwordArea' ).hide();
		$( '#timerArea' ).show();

		lightdm.respond( passwd );
	}


	session_toggle_handler( event ) {
		var $session = $( this ).children( 'a' ),
			session_name = $session.text(),
			session_key = $session.attr( 'data-session-id' );

		$session.parents( '.btn-group' ).find( '.selected' ).attr( 'data-session-id', session_key ).html( session_name );
	}


	key_press_handler( event ) {
		let action = null;

		switch ( event.which ) {
			case 13:
				action = _self.auth_pending ? _self.submit_password : ! _self.user_list_visible ? _self.show_user_list : 0;
				break;
			case 27:
				action = _self.auth_pending ? _self.cancel_authentication : 0;
				break;
			case 32:
				action = (! _self.user_list_visible && ! _self.auth_pending) ? _self.show_user_list : 0;
				break;
			default:
				break;
		}

		if ( action instanceof Function ) {
			action();
		}
	}


	system_action_handler() {
		var action = $( this ).attr( 'id' ),
			$modal = $( '.modal' );

		$modal.find( '.btn-primary' ).text( _util.translations[ action ] ).click( action, ( event ) => {
			$( this ).off( 'click' );
			$( 'body' ).fadeOut( 1000, () => {
				lightdm[event.data]();
			});
		} );
		$modal.find( '.btn-default' ).click( () => {
			$( this ).next().off( 'click' );
		} );

		$modal.modal( 'toggle' );
	}


	user_list_collapse_handler( event ) {
		_self.user_list_visible = $(event.target).hasClass( 'in' );
		_self.show_user_list(_self.user_list_visible);
	}


	user_image_error_handler( event ) {
		$( this ).off( 'error.antergos' );
		$( this ).attr( 'src', _self.tux );
	}


	show_log_handler( event ) {
		if ( _util.$log_container.is( ':visible' ) ) {
			_util.$log_container.hide();
		} else {
			_util.$log_container.show();
		}
	}


	/**
	 * LightDM Callback - Show prompt to user.
	 *
	 * @param text
	 * @param type
	 */
	show_prompt( text, type ) {
		if ( 'password' === type ) {
			$( '#passwordField' ).val( "" );
			$( '#passwordArea' ).show();
			$( '#passwordField' ).focus();
		}
	}

	/**
	 * LightDM Callback - Show message to user.
	 *
	 * @param text
	 * @param type
	 */
	show_message( text, type ) {
		if (! text.length ) {
			_util.log('show_message() called without a message to show!');
			return;
		}

		let $msg_container = this.$msg_area_container.children('.alert-dismissible');

		if (! $msg_container.length ) {
			$msg_container = this.$alert_msg_tpl.clone();
			$msg_container.appendTo( this.$msg_area_container );
		}

		$msg_container.on('closed.bs.alert', _self.cancel_authentication);

		$msg_container.html( $msg_container.html() + text );
		$( '#collapseTwo .user-wrap2' ).hide();
		this.$msg_area_container.show();

	}
}



/**
 * Initialize the theme once the window has loaded.
 */
$( window ).on('load', () => {
	new AntergosThemeUtils();
	new AntergosTheme();
} );
