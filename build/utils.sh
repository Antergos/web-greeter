#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


do_build() {
	(cd "$(dirname "${DIR}")" \
		&& meson build \
		&& cd build \
		&& ninja)
}

do_quick_install() {
	(cd "$(dirname "${DIR}")/build/src" \
		&& sudo cp lightdm-webkit2-greeter /usr/bin \
		&& sudo cp liblightdm-webkit2-greeter-webext.so /usr/lib/lightdm-webkit2-greeter \
		&& sudo cp -R ../../themes/antergos /usr/share/lightdm-webkit/themes)
}

clean_build_dir() {
	(cd "${DIR}" \
		&& find . -type f ! -path './ci*' ! -name '.gitignore' ! -name utils.sh -delete \
		&& find . -type d ! -path './ci' -delete \
		&& { rm ../src/gresource/js/bundle.js || true; })
}

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

	clean-build-dir)
		clean_build_dir
	;;

	build)
		clean_build_dir && do_build
	;;

	build-dev)
		clean_build_dir && do_build && do_quick_install
	;;
esac
