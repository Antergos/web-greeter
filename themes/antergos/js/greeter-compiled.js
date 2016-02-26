'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
 * This is used to access our classes from within jQuery callbacks.
 */
var _self = null;
var _bg_self = null;

/**
 * Capitalize a string.
 *
 * @returns {string}
 */
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * This class handles the theme's background switcher.
 */

var GreeterThemeComponent = (function () {
	function GreeterThemeComponent() {
		_classCallCheck(this, GreeterThemeComponent);

		this.debug = this.cache_get('debug', 'enabled');
		this.lang = window.navigator.language.split('-')[0].toLowerCase();
		this.translations = window.ant_translations;

		if ('undefined' === typeof window.navigator.languages) {
			window.navigator.languages = [window.navigator.language];
		}

		this.init_config_values();
	}

	/**
  * Add text to the debug log element (accessible from the login screen).
  *
  * @param {string} text - To be added to the log.
  */

	_createClass(GreeterThemeComponent, [{
		key: 'log',
		value: function log(text) {
			if ('true' === this.debug) {
				console.log(text);
			}
			$('#logArea').append(text + '<br/>');
		}

		/**
   * Get a key's value from localStorage. Keys can have two or more parts.
   * For example: "ant:user:john:session".
   *
   * @param {...string} key_parts - Strings that are combined to form the key.
   */

	}, {
		key: 'cache_get',
		value: function cache_get() {
			var key = 'ant';

			for (var _len = arguments.length, key_parts = Array(_len), _key = 0; _key < _len; _key++) {
				key_parts[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = key_parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var part = _step.value;

					key += ':' + part;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return localStorage.getItem(key);
		}

		/**
   * Set a key's value in localStorage. Keys can have two or more parts.
   * For example: "ant:user:john:session".
   *
   * @param {string} value - The value to set.
   * @param {...string} key_parts - Strings that are combined to form the key.
   */

	}, {
		key: 'cache_set',
		value: function cache_set(value) {
			var key = 'ant';

			for (var _len2 = arguments.length, key_parts = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				key_parts[_key2 - 1] = arguments[_key2];
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = key_parts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var part = _step2.value;

					key += ':' + part;
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return localStorage.setItem(key, value);
		}

		/**
   * Get some values from `lightdm-webkit2-greeter.conf` and save them for later.
   */

	}, {
		key: 'init_config_values',
		value: function init_config_values() {
			var logo = '',
			    background_images = [],
			    background_images_dir = '';

			if ('undefined' !== typeof config) {
				if (this instanceof AntergosTheme) {
					logo = config.get_str('branding', 'logo_image') || '';
				} else if (this instanceof AntergosBackgroundManager) {
					background_images_dir = config.get_str('branding', 'background_images') || '';
					if (background_images_dir) {
						background_images = greeterutil.dirlist(background_images_dir) || [];
					}
				}
			}

			this.logo = logo;
			this.background_images = background_images;
			this.background_images_dir = background_images_dir;
		}
	}]);

	return GreeterThemeComponent;
})();

/**
 * This class handles the theme's background switcher.
 */

var AntergosBackgroundManager = (function (_GreeterThemeComponen) {
	_inherits(AntergosBackgroundManager, _GreeterThemeComponen);

	function AntergosBackgroundManager() {
		var _ret2;

		_classCallCheck(this, AntergosBackgroundManager);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AntergosBackgroundManager).call(this));

		if (null === _bg_self) {
			_bg_self = _this;
		}

		_this.current_background = _this.cache_get('background_config', 'current_background');

		if (!_this.background_images_dir.length || !_this.background_images.length) {
			var _ret;

			_this.log('AntergosBackgroundManager: [ERROR] No background images detected.');
			$('.header').fadeTo(300, 0.5, function () {
				$('.header').css("background", '#000000');
			}).fadeTo(300, 1);
			return _ret = _bg_self, _possibleConstructorReturn(_this, _ret);
		}

		_this.initialize();

		return _ret2 = _bg_self, _possibleConstructorReturn(_this, _ret2);
	}

	_createClass(AntergosBackgroundManager, [{
		key: 'initialize',
		value: function initialize() {
			if (!this.current_background) {
				// For backwards compatibility
				if (null !== localStorage.getItem('bgsaved') && '0' === localStorage.getItem('bgrandom')) {
					this.current_background = localStorage.getItem('bgsaved');
					this.cache_set(this.current_background, 'background_manager', 'current_background');
					localStorage.removeItem('bgrandom');
					localStorage.removeItem('bgsaved');
				} else if ('0' === localStorage.getItem('bgrandom')) {
					this.current_background = this.get_random_image();
					this.cache_set('true', 'background_manager', 'random_background');
					localStorage.removeItem('bgrandom');
				}
			}

			if (!this.current_background) {
				// For current and future versions
				var current_background = this.cache_get('background_manager', 'current_background'),
				    random_background = this.cache_get('background_manager', 'random_background');

				if ('true' === random_background || !current_background) {
					current_background = this.get_random_image();
				}
				this.current_background = current_background;
			}

			$('.header').fadeTo(300, 0.5, function () {
				$('.header').css("background", this.current_background);
			}).fadeTo(300, 1);
		}
	}, {
		key: 'get_random_image',
		value: function get_random_image() {
			var random_bg = undefined;

			random_bg = Math.floor(Math.random() * this.background_images.length);

			return this.background_images[random_bg];
		}
	}, {
		key: 'get_old_backgrounds',
		value: function get_old_backgrounds() {
			var old_backgrounds = [];

			$('.bgs .clearfix').each(function (i) {
				if (i > 0) {
					old_backgrounds.push($(this).attr('data-img'));
				}
			});
		}
	}]);

	return AntergosBackgroundManager;
})(GreeterThemeComponent);

/**
 * This is the theme's main class object. It contains almost all the theme's logic.
 */

var AntergosTheme = (function (_GreeterThemeComponen2) {
	_inherits(AntergosTheme, _GreeterThemeComponen2);

	function AntergosTheme() {
		var _ret3;

		_classCallCheck(this, AntergosTheme);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(AntergosTheme).call(this));

		if (null === _self) {
			_self = _this2;
		}
		_this2.user_list_visible = false;
		_this2.auth_pending = false;
		_this2.selected_user = null;
		_this2.$user_list = $('#user-list2');
		_this2.$session_list = $('#sessions');
		_this2.$clock_container = $('#collapseOne');
		_this2.$clock = $("#current_time");
		_this2.$actions_container = $("#actionsArea");
		_this2.$msg_area_container = $('#statusArea');
		_this2.$msg_area = $('#showMsg');
		_this2.background_manager = new AntergosBackgroundManager();

		_this2.initialize();

		return _ret3 = _self, _possibleConstructorReturn(_this2, _ret3);
	}

	_createClass(AntergosTheme, [{
		key: 'initialize',
		value: function initialize() {
			this.prepare_translations();
			this.do_static_translations();
			this.initialize_clock();
			this.prepare_login_panel_header();
			this.prepare_user_list();
			this.prepare_session_list();
			this.prepare_system_action_buttons();

			this.register_callbacks();
		}

		/**
   * Register callbacks for the LDM Greeter as well as any others that haven't been registered
   * elsewhere.
   */

	}, {
		key: 'register_callbacks',
		value: function register_callbacks() {
			var events = 'shown.bs.collapse, hidden.bs.collapse';

			this.$user_list.parents('.collapse').on(events, this.user_list_collapse_handler);
			$(document).keydown(this.key_press_handler);
			$('.cancel_auth').click(this.cancel_authentication);
			$('.submit_passwd').click(this.submit_password);

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

	}, {
		key: 'prepare_user_list',
		value: function prepare_user_list() {
			var tux = 'img/antergos-logo-user.png',
			    template;

			// Loop through the array of LightDMUser objects to create our user list.
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = lightdm.users[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var user = _step3.value;

					var last_session = this.cache_get('user', user.name, 'session'),
					    image_src = user.image.length ? user.image : tux;

					if (null === last_session) {
						// For backwards compatibility
						last_session = localStorage.getItem(user.name);
						if (null === last_session) {
							// This user has never logged in before let's enable the system's default
							// session.
							last_session = lightdm.default_session;
						}
						this.cache_set(last_session, 'user', user.name, 'session');
					}

					this.log('Last session for ' + user.name + ' was: ' + last_session);

					template = '\n\t\t\t\t<a href="#" id="' + user.name + '" class="list-group-item ' + user.name + '" data-session="' + last_session + '">\n\t\t\t\t\t<img src="' + image_src + '" class="img-circle" alt="' + user.display_name + '" />\n\t\t\t\t\t<span>' + user.display_name + '</span>\n\t\t\t\t\t<span class="badge"><i class="fa fa-check"></i></span>\n\t\t\t\t</a>';

					// Register event handler here so we don't have to iterate over the users again later.
					$(template).appendTo(this.$user_list).click(this.start_authentication);
				} // END for ( var user of lightdm.users )
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			if ($(this.$user_list).children().length > 3) {
				// Make the user list two columns instead of one.
				$(this.$user_list).css('column-count', '2').parent().css('max-width', '85%');
			}
		}

		/**
   * Initialize the session selection dropdown.
   */

	}, {
		key: 'prepare_session_list',
		value: function prepare_session_list() {
			// Loop through the array of LightDMSession objects to create our session list.
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = lightdm.sessions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var session = _step4.value;

					var css_class = session.name.replace(/ /g, ''),
					    template;

					this.log('Adding ' + session.name + ' to the session list...');

					template = '\n\t\t\t\t<li>\n\t\t\t\t\t<a href="#" data-session-id="' + session.key + '" class="' + css_class + '">' + session.name + '</a>\n\t\t\t\t</li>';

					$(template).appendTo(this.$session_list).click(this.session_toggle_handler);
				} // END for (var session of lightdm.sessions)
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			$('.dropdown-toggle').dropdown();
		}

		/**
   * Initialize the system action buttons
   */

	}, {
		key: 'prepare_system_action_buttons',
		value: function prepare_system_action_buttons() {
			var actions = {
				shutdown: "power-off",
				hibernate: "asterisk",
				suspend: "arrow-down",
				restart: "refresh"
			},
			    template;

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = Object.keys(actions)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var action = _step5.value;

					var cmd = 'can_' + action;

					template = '\n\t\t\t\t<a href="#" id="' + action + '" class="btn btn-default ' + action + '" data-toggle="tooltip" data-placement="top" title="' + action.capitalize() + '" data-container="body">\n\t\t\t\t\t<i class="fa fa-' + actions[action] + '"></i>\n\t\t\t\t</a>';

					if (lightdm[cmd]) {
						$(template).appendTo($(this.$actions_container)).click(this.system_action_handler);
					}
				} // END for (var [action, icon] of actions)
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			$('[data-toggle=tooltip]').tooltip();
			$('.modal').modal({ show: false });
		}
	}, {
		key: 'initialize_clock',
		value: function initialize_clock() {
			var _this3 = this;

			var saved_format = this.cache_get('clock', 'time_format'),
			    format = null !== saved_format ? saved_format : 'LT';

			moment.locale(window.navigator.languages);
			this.$clock.html(moment().format(format));

			setInterval(function () {
				_this3.$clock.html(moment().format(format));
			}, 60000);
		}

		/**
   * Show the user list if its not already shown. This is used to allow the user to
   * display the user list by pressing Enter or Spacebar.
   */

	}, {
		key: 'show_user_list',
		value: function show_user_list() {
			if ($(this.$clock_container).hasClass('in')) {
				$('#trigger').trigger('click');
			}
			if ($(this.$user_list).length <= 1) {
				$(this.$user_list).find('a').trigger('click', this);
			}
		}
	}, {
		key: 'prepare_login_panel_header',
		value: function prepare_login_panel_header() {
			var greeting = this.translations.greeting ? this.translations.greeting : 'Welcome!',
			    logo = '' !== this.logo ? this.logo : 'img/antergos.png';

			$('.welcome').text(greeting);
			$('#hostname').append(lightdm.hostname);
		}
	}, {
		key: 'prepare_translations',
		value: function prepare_translations() {
			if (!this.translations.hasOwnProperty(this.lang)) {
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = window.navigator.languages[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var lang = _step6.value;

						if (this.translations.hasOwnProperty(lang)) {
							this.lang = lang;
							break;
						}
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}
			}
			if (!this.translations.hasOwnProperty(this.lang)) {
				this.lang = 'en';
			}

			this.translations = this.translations[this.lang];
		}

		/**
   * Replace '${i18n}' with translated string for all elements that
   * have the data-i18n attribute. This is for elements that are not generated
   * dynamically (they can be found in index.html).
   */

	}, {
		key: 'do_static_translations',
		value: function do_static_translations() {
			$('[data-i18n]').each(function () {
				var key = $(this).attr('data-i18n'),
				    html = $(this).html(),
				    translated = _self.translations[key],
				    new_html = html.replace('${i18n}', translated);

				$(this).html(new_html);
			});
		}

		/**
   * Start the authentication process for the selected user.
   *
   * @param {object} event - jQuery.Event object from 'click' event.
   */

	}, {
		key: 'start_authentication',
		value: function start_authentication(event) {
			var user_id = $(this).attr('id'),
			    selector = '.' + user_id,
			    user_session = _self.cache_get('user', user_id, 'session');

			if (_self.auth_pending || null !== _self.selected_user) {
				lightdm.cancel_authentication();
				_self.log('Authentication cancelled for ' + _self.selected_user);
				_self.selected_user = null;
			}

			_self.log('Starting authentication for ' + user_id + '.');
			_self.selected_user = user_id;

			// CSS hack to workaround webkit bug
			if ($(_self.$user_list).children().length > 3) {
				$(_self.$user_list).css('column-count', 'initial').parent().css('max-width', '50%');
			}
			$(selector).addClass('hovered').siblings().hide();
			$('.fa-toggle-down').hide();

			_self.log('Session for ' + user_id + ' is ' + user_session);

			$('[data-session-id="' + user_session + '"]').parent().trigger('click', this);

			$('#session-list').removeClass('hidden').show();
			$('#passwordArea').show();
			$('.dropdown-toggle').dropdown();

			_self.auth_pending = true;

			lightdm.authenticate(user_id);
		}

		/**
   * Cancel the pending authentication.
   *
   * @param {object} event - jQuery.Event object from 'click' event.
   */

	}, {
		key: 'cancel_authentication',
		value: function cancel_authentication(event) {
			var selectors = ['#statusArea', '#timerArea', '#passwordArea', '#session-list'];

			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = selectors[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var selector = _step7.value;

					$(selector).hide();
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			lightdm.cancel_authentication();

			_self.log('Cancelled authentication.');

			// CSS hack to work-around webkit bug
			if ($(_self.$user_list).children().length > 3) {
				$(_self.$user_list).css('column-count', '2').parent().css('max-width', '85%');
			}

			$('.hovered').removeClass('hovered').siblings().show();
			$('.fa-toggle-down').show();

			_self.selected_user = null;
			_self.auth_pending = false;
		}

		/**
   * Called when the user attempts to authenticate (inputs password).
   * We check to see if the user successfully authenticated and if so tell the LDM
   * Greeter to log them in with the session they selected.
   */

	}, {
		key: 'authentication_complete',
		value: function authentication_complete() {
			var selected_session = $('.selected').attr('data-session-id'),
			    err_msg = _self.translations.auth_failed[_self.lang];

			_self.auth_pending = false;
			_self.cache_set(selected_session, 'user', lightdm.authentication_user, 'session');

			$('#timerArea').hide();

			if (lightdm.is_authenticated) {
				// The user entered the correct password. Let's log them in.
				$('body').fadeOut();
				lightdm.login(lightdm.authentication_user, selected_session);
			} else {
				// The user did not enter the correct password. Show error message.
				$('#statusArea').show();
			}
		}
	}, {
		key: 'submit_password',
		value: function submit_password(event) {
			lightdm.respond($('#passwordField').val());
			$('#passwordArea').hide();
			$('#timerArea').show();
		}
	}, {
		key: 'session_toggle_handler',
		value: function session_toggle_handler(event) {
			var $session = $(this).children('a'),
			    session_name = $session.text(),
			    session_key = $session.attr('data-session-id');

			$session.parents('.btn-group').find('.selected').attr('data-session-id', session_key).html(session_name);
		}
	}, {
		key: 'key_press_handler',
		value: function key_press_handler(event) {
			var action;
			switch (event.which) {
				case 13:
					action = _self.auth_pending ? _self.submit_password() : !_self.user_list_visible ? _self.show_user_list() : 0;
					_self.log(action);
					break;
				case 27:
					action = _self.auth_pending ? _self.cancel_authentication() : 0;
					_self.log(action);
					break;
				case 32:
					action = !_self.user_list_visible && !_self.auth_pending ? _self.show_user_list() : 0;
					_self.log(action);
					break;
				default:
					break;
			}
		}
	}, {
		key: 'system_action_handler',
		value: function system_action_handler() {
			var _this4 = this;

			var action = $(this).attr('id'),
			    $modal = $('.modal');

			$modal.find('.btn-primary').text(_self.translations[action]).click(action, function (event) {
				$(_this4).off('click');
				lightdm[event.data]();
			});
			$modal.find('.btn-default').click(function () {
				$(_this4).next().off('click');
			});

			$modal.modal('toggle');
		}
	}, {
		key: 'user_list_collapse_handler',
		value: function user_list_collapse_handler() {
			_self.user_list_visible = _self.$user_list.hasClass('in') ? true : false;
		}

		/**
   * LightDM Callback - Show password prompt to user.
   *
   * @param text
   * @param type
   */

	}, {
		key: 'show_prompt',
		value: function show_prompt(text, type) {
			if ('password' === type) {
				$('#passwordField').val("");
				$('#passwordArea').show();
				$('#passwordField').focus();
			}
		}

		/**
   * LightDM Callback - Show message to user.
   *
   * @param text
   */

	}, {
		key: 'show_message',
		value: function show_message(text, type) {
			if (text.length > 0) {
				$(this.$msg_area).html(text);
				$('#passwordArea').hide();
				$(this.$msg_area_container).show();
			}
		}
	}]);

	return AntergosTheme;
})(GreeterThemeComponent);

/**
 * Initialize the theme once the window has loaded.
 */

$(window).load(function () {
	_self = new AntergosTheme();
});

//# sourceMappingURL=greeter-compiled.js.map