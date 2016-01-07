'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
 * This is used to access our main class from within jQuery callbacks.
 */
var _self = null;

/**
 * Capitalize a string.
 *
 * @returns {string}
 */
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * This is the theme's main class object. It contains almost all the theme's logic.
 */

var AntergosTheme = (function () {
	function AntergosTheme() {
		_classCallCheck(this, AntergosTheme);

		if (null !== _self) {
			return _self;
		}
		this.debug = this.cache_get('debug', 'enabled');
		this.user_list_visible = false;
		this.auth_pending = false;
		this.selected_user = null;
		this.$user_list = $('#user-list2');
		this.$session_list = $('#sessions');
		this.$clock_container = $('#collapseOne');
		this.$clock = $("#current_time");
		this.$actions_container = $("#actionsArea");
		this.$msg_area_container = $('#statusArea');
		this.$msg_area = $('#showMsg');
		this.lang = window.navigator.language.split('-')[0].toLowerCase();
		this.translations = window.ant_translations;

		this.initialize();
	}

	_createClass(AntergosTheme, [{
		key: 'initialize',
		value: function initialize() {
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

	}, {
		key: 'log',
		value: function log(text) {
			if ('true' === this.debug || true) {
				$('#logArea').append(text + '<br/>');
			}
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
			var key = 'ant',
			    index = 0;

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
					index += 1;
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
			var key = 'ant',
			    index = 0;

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
					index += 1;
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
   * Register callbacks for the LDM Greeter as well as any others that haven't been registered
   * elsewhere.
   */

	}, {
		key: 'register_callbacks',
		value: function register_callbacks() {
			$(document).keydown(this.key_press_handler);
			$('.cancel_auth').click(this.cancel_authentication);
			$('.submit_passwd').click(this.submit_password);
			window.show_prompt = this.show_prompt;
			window.show_message = this.show_message;
			window.start_authentication = this.start_authentication;
			window.cancel_authentication = this.cancel_authentication;
			window.authentication_complete = this.authentication_complete;
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
					$(template).appendTo(this.$user_list).click(this.start_authentication).children('img').on('error', this.image_not_found);
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
						$(template).appendTo($(this.$actions_container)).click(action, function (event) {
							lightdm[event.data]();
						});
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
		}
	}, {
		key: 'initialize_clock',
		value: function initialize_clock() {
			var _this = this;

			var saved_format = this.cache_get('clock', 'time_format'),
			    format = null !== saved_format ? saved_format : 'LT',
			    detected_language = 'en';
			window.navigator.languages = typeof window.navigator.languages !== 'undefined' ? window.navigator.languages : [window.navigator.language];

			// Workaround for moment.js bug: https://github.com/moment/moment/issues/2856
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = window.navigator.languages[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var lang = _step6.value;

					try {
						detected_language = lang.split('-')[0].toLowerCase();
						break;
					} catch (err) {
						this.log(String(err));
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

			if (null === detected_language) {
				detected_language = 'en';
			}

			moment.locale(detected_language);
			this.$clock.html(moment().format(format));

			setInterval(function () {
				_this.$clock.html(moment().format(format));
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
				this.user_list_visible = true;
			}
			if ($(this.$user_list).length <= 1) {
				$(this.$user_list).find('a').trigger('click', this);
			}
		}
	}, {
		key: 'prepare_login_panel_header',
		value: function prepare_login_panel_header() {
			var greeting = null;

			if (this.translations.hasOwnProperty(this.lang)) {
				greeting = this.translations[this.lang];
			} else {
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {

					for (var _iterator7 = window.navigator.languages[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var lang = _step7.value;

						if (this.translations.hasOwnProperty(lang)) {
							greeting = this.translations[lang];
							break;
						}
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
			}

			greeting = null === greeting ? 'Welcome!' : greeting;

			$('.welcome').text(greeting);
			$('#hostname').append(lightdm.hostname);
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

			lightdm.start_authentication(user_id);
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

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = selectors[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var selector = _step8.value;

					$(selector).hide();
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
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
			var selected_session = $('.selected').attr('data-session-id');

			_self.auth_pending = false;
			_self.cache_set(selected_session, 'user', lightdm.authentication_user, 'session');

			$('#timerArea').hide();

			if (lightdm.is_authenticated) {
				// The user entered the correct password. Let's log them in.
				lightdm.login(lightdm.authentication_user, selected_session);
			} else {
				// The user did not enter the correct password. Show error message.
				$('#statusArea').show();
			}
		}
	}, {
		key: 'submit_password',
		value: function submit_password(event) {
			lightdm.provide_secret($('#passwordField').val());
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

		/**
   * User image on('error') handler.
   */

	}, {
		key: 'image_not_found',
		value: function image_not_found(source) {
			source.onerror = "";
			source.src = 'img/antergos-logo-user.png';
			return true;
		}

		/**
   * LightDM Callback - Show password prompt to user.
   *
   * @param text
   */

	}, {
		key: 'show_prompt',
		value: function show_prompt(text) {

			$('#passwordField').val("");
			$('#passwordArea').show();
			$('#passwordField').focus();
		}

		/**
   * LightDM Callback - Show message to user.
   *
   * @param msg
   */

	}, {
		key: 'show_message',
		value: function show_message(msg) {
			if (msg.length > 0) {
				$(this.$msg_area).html(msg);
				$('#passwordArea').hide();
				$(this.$msg_area_container).show();
			}
		}
	}]);

	return AntergosTheme;
})();

/**
 * Initialize the theme once the window has loaded.
 */

$(window).load(function () {
	_self = new AntergosTheme();
});

//# sourceMappingURL=greeter-compiled.js.map