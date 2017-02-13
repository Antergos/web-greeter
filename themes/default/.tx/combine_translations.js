/*
 * Copyright © 2015-2017 Antergos
 *
 * combine_translations.js
 *
 * This file is part of Web Greeter
 *
 * Web Greeter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * Web Greeter is distributed in the hope that it will be useful,
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

var fs = require( "fs" ),
	path = require( 'path' ),
	i18n_dir = process.argv[2] + '/i18n/',
	translation_files = fs.readdirSync( i18n_dir ),
	output = i18n_dir + 'translations.json',
	translations = {};


function sortObj( obj, order ) {
	"use strict";

	var key,
		tempArry = [],
		i,
		tempObj = {};

	for ( key in obj ) {
		tempArry.push( key );
	}

	tempArry.sort(
		function( a, b ) {
			return a.toLowerCase().localeCompare( b.toLowerCase() );
		}
	);

	if ( order === 'desc' ) {
		for ( i = tempArry.length - 1; i >= 0; i -- ) {
			tempObj[ tempArry[ i ] ] = obj[ tempArry[ i ] ];
		}
	} else {
		for ( i = 0; i < tempArry.length; i ++ ) {
			tempObj[ tempArry[ i ] ] = obj[ tempArry[ i ] ];
		}
	}

	return tempObj;
}


for ( var file of translation_files ) {
	var abs_path = i18n_dir + file,
		lang = file.replace( '.json', '' );

	if ( 'translations.json' === file ) {
		console.log( 'found' );
		continue;
	}

	translations[ lang ] = JSON.parse( fs.readFileSync( abs_path, 'utf8' ) );
}

translations = sortObj( translations );

fs.writeFile( output, JSON.stringify( translations ), function( error ) {
	if ( error ) {
		console.error( "write error:  " + error.message );
	} else {
		console.log( "Successful Write to " + output );
	}
} );
fs.writeFile( i18n_dir.replace('/i18n/', '') + '/js/translations.js', 'window.ant_translations = ' + JSON.stringify( translations ), function( error ) {
	if ( error ) {
		console.error( "write error:  " + error.message );
	} else {
		console.log( "Successful Write to " + i18n_dir.replace('/i18n/', '') + '/js/translations.js' );
	}
} );

console.log( 'Done!' );
