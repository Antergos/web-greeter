/*
 *
 * Copyright © 2015-2016 Antergos
 *
 * mock.js
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

// mock lighdm for testing
if ( typeof lightdm == 'undefined' ) {
	lightdm = {};
	lightdm.hostname = "test-host";
	lightdm.languages = [ {
		code: "en_US",
		name: "English(US)",
		territory: "USA"
	}, { code: "en_UK", name: "English(UK)", territory: "UK" } ];
	lightdm.default_language = lightdm.languages[ 0 ];
	lightdm.layouts = [ {
		name: "test",
		short_description: "test description",
		short_description: "really long epic description"
	} ];
	lightdm.default_layout = lightdm.layouts[ 0 ];
	lightdm.layout = lightdm.layouts[ 0 ];
	lightdm.sessions = [ { key: "gnome", name: "gnome", comment: "no comment" }, {
		key: "cinnamon",
		name: "cinnamon",
		comment: "no comment"
	}, { key: "openbox", name: "openbox", comment: "no comment" }, {
		key: "key4",
		name: "kde",
		comment: "no comment"
	} ];

	lightdm.default_session = lightdm.sessions[ 0 ][ 'name' ];
	lightdm.authentication_user = null;
	lightdm.is_authenticated = false;
	lightdm.can_suspend = true;
	lightdm.can_hibernate = true;
	lightdm.can_restart = true;
	lightdm.can_shutdown = true;
	lightdm.awaiting_username = false;

	lightdm.users = [
		{
			name: "clarkk",
			real_name: "Superman",
			display_name: "Clark Kent",
			image: "",
			language: "en_US",
			layout: null,
			session: "gnome",
			logged_in: false
		},
		{
			name: "brucew",
			real_name: "Batman",
			display_name: "Bruce Wayne",
			image: "",
			language: "en_US",
			layout: null,
			session: "cinnamon",
			logged_in: false
		},
		{
			name: "peterp",
			real_name: "Spiderman",
			display_name: "Peter Parker",
			image: "",
			language: "en_US",
			layout: null,
			session: "gnome",
			logged_in: true
		},
		{
			name: "clarkk2",
			real_name: "Superman",
			display_name: "Clark Kent",
			image: "",
			language: "en_US",
			layout: null,
			session: "gnome",
			logged_in: false
		},
		{
			name: "brucew2",
			real_name: "Batman",
			display_name: "Bruce Wayne",
			image: "",
			language: "en_US",
			layout: null,
			session: "cinnamon",
			logged_in: false
		},
		{
			name: "peterp2",
			real_name: "Spiderman",
			display_name: "Peter Parker",
			image: "",
			language: "en_US",
			layout: null,
			session: "gnome",
			logged_in: true
		}
	];

	lightdm.num_users = lightdm.users.length;
	lightdm.timed_login_delay = 0; //set to a number higher than 0 for timed login simulation
	lightdm.timed_login_user = lightdm.timed_login_delay > 0 ? lightdm.users[ 0 ] : null;

	lightdm.get_string_property = function() {
	};
	lightdm.get_integer_property = function() {
	};
	lightdm.get_boolean_property = function() {
	};
	lightdm.cancel_timed_login = function() {
		_lightdm_mock_check_argument_length( arguments, 0 );
		lightdm._timed_login_cancelled = true;
	};

	lightdm.provide_secret = function( secret ) {
		if ( typeof lightdm._username == 'undefined' || ! lightdm._username ) {
			throw "must call start_authentication first"
		}
		_lightdm_mock_check_argument_length( arguments, 1 );
		var user = _lightdm_mock_get_user( lightdm.username );

		if ( ! user && secret == lightdm._username ) {
			lightdm.is_authenticated = true;
			lightdm.authentication_user = user;
		} else {
			lightdm.is_authenticated = false;
			lightdm.authentication_user = null;
			lightdm._username = null;
		}
		authentication_complete();
	};

	lightdm.start_authentication = function( username ) {
		if ( 'undefined' === typeof username ) {
			show_prompt( "Username?", 'text' );
			lightdm.awaiting_username = true;
			return;
		}
		_lightdm_mock_check_argument_length( arguments, 1 );
		if ( lightdm._username ) {
			throw "Already authenticating!";
		}
		var user = _lightdm_mock_get_user( username );
		if ( ! user ) {
			show_error( username + " is an invalid user" );
		}
		show_prompt( "Password: " );
		lightdm._username = username;
	};

	lightdm.cancel_authentication = function() {
		_lightdm_mock_check_argument_length( arguments, 0 );
		if ( ! lightdm._username ) {
			console.log( "we are not authenticating" );
		}
		lightdm._username = null;
	};

	lightdm.suspend = function() {
		alert( "System Suspended. Bye Bye" );
		document.location.reload( true );
	};

	lightdm.hibernate = function() {
		alert( "System Hibernated. Bye Bye" );
		document.location.reload( true );
	};

	lightdm.restart = function() {
		alert( "System restart. Bye Bye" );
		document.location.reload( true );
	};

	lightdm.shutdown = function() {
		alert( "System Shutdown. Bye Bye" );
		document.location.reload( true );
	};

	lightdm.login = function( user, session ) {
		_lightdm_mock_check_argument_length( arguments, 2 );
		if ( ! lightdm.is_authenticated ) {
			throw "The system is not authenticated";
		}
		if ( user !== lightdm.authentication_user ) {
			throw "this user is not authenticated";
		}
		alert( "logged in successfully!!" );
		document.location.reload( true );
	};
	lightdm.authenticate = function( session ) {
		lightdm.login( null, session );
	};
	lightdm.respond = function( response ) {
		if ( true === lightdm.awaiting_username ) {
			lightdm.awaiting_username = false;
			lightdm.start_authentication( response );
		} else {
			lightdm.provide_secret( response );
		}
	};
	lightdm.start_session_sync = function() {
		lightdm.login( null, null );
	};

	if ( lightdm.timed_login_delay > 0 ) {
		setTimeout( function() {
			if ( ! lightdm._timed_login_cancelled() ) {
				timed_login();
			}
		}, lightdm.timed_login_delay );
	}

	var config = {},
		greeterutil = {};

	config.get_str = function( section, key ) {
		var branding = {
			logo: 'img/antergos.png',
			user_logo: 'ing/antergos-logo-user.png',
			background_images: '/usr/share/antergos/wallpapers'
		};
		if ( 'branding' === section ) {
			return branding[ key ];
		}
	};

	greeterutil.dirlist = function( directory ) {
		if ( '/usr/share/antergos/wallpapers' === directory ) {
			return [
				'/usr/share/antergos/wallpapers/83II_by_bo0xVn.jpg',
				'/usr/share/antergos/wallpapers/antergos-wallpaper.png',
				'/usr/share/antergos/wallpapers/as_time_goes_by____by_moskanon-d5dgvt8.jpg',
				'/usr/share/antergos/wallpapers/autumn_hike___plant_details_by_aoiban-d5l7y83.jpg',
				'/usr/share/antergos/wallpapers/blossom_by_snipes2.jpg',
				'/usr/share/antergos/wallpapers/c65sk3mshowxrtlljbvh.jpg',
				'/usr/share/antergos/wallpapers/early_morning_by_kylekc.jpg',
				'/usr/share/antergos/wallpapers/extinction_by_signcropstealer-d5j4y84.jpg',
				'/usr/share/antergos/wallpapers/field_by_stevenfields-d59ap2i.jpg',
				'/usr/share/antergos/wallpapers/Grass_by_masha_darkelf666.jpg',
				'/usr/share/antergos/wallpapers/Grass_Fullscreen.jpg',
				'/usr/share/antergos/wallpapers/humble_by_splendidofsun-d5g47hb.jpg',
				'/usr/share/antergos/wallpapers/In_the_Grass.jpg',
				'/usr/share/antergos/wallpapers/morning_light.jpg',
				'/usr/share/antergos/wallpapers/Nautilus_Fullscreen.jpg',
				'/usr/share/antergos/wallpapers/nikon_d40.jpg',
				'/usr/share/antergos/wallpapers/sky_full_of_stars.jpg',
				'/usr/share/antergos/wallpapers/solely_by_stevenfields.jpg',
				'/usr/share/antergos/wallpapers/the_world_inside_my_lens__by_moskanon-d5fsiqs.jpg',
				'/usr/share/antergos/wallpapers/white_line_by_snipes2.jpg'
			]
		}
	}
}

function _lightdm_mock_check_argument_length( args, length ) {
	if ( args.length != length ) {
		throw "incorrect number of arguments in function call";
	}
}

function _lightdm_mock_get_user( username ) {
	var user = null;
	for ( var i = 0; i < lightdm.users.length; ++ i ) {
		if ( lightdm.users[ i ].name == username ) {
			user = lightdm.users[ i ];
			break;
		}
	}
	return user;
}