#!/bin/bash


combine_javascript_sources() {
	cd "${MESON_SOURCE_ROOT}/src/gresource/js" && {
		cat _vendor/moment-with-locales.min.js \
			LightDMObjects.js \
			Greeter.js \
			GreeterConfig.js \
			ThemeUtils.js \
			ThemeHeartbeat.js >> "${MESON_SOURCE_ROOT}/src/gresource/js/bundle.js"
	}
}

list_javascript_sources() {
	cd "${MESON_SOURCE_ROOT}/src" && find gresource/js -type f -name '*.js' -print
}


case "$1" in
	combine-js)
		combine_javascript_sources
	;;

	get-js-files)
		list_javascript_sources
	;;
esac
