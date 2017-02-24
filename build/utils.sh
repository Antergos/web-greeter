#!/bin/bash

BUILD_DIR="$(realpath $(dirname "${BASH_SOURCE[0]}"))"
REPO_DIR="$(dirname "${BUILD_DIR}")"
INSTALL_ROOT="${BUILD_DIR}/install_root"
PKGNAME='web-greeter'
DESTDIR=''
PREFIX=''


_handle_error() {
	LASTLINE="$1"
	LASTERR="$2"
	(>&2 echo "${BASH_SOURCE[0]}: line ${LASTLINE}: exit status of last command: ${LASTERR}")
	exit "${LASTERR}"
}

clean_build_dir() {
	find "${BUILD_DIR}" -type f ! -path '**/ci/**' ! -name '*.yml' ! -name utils.sh -delete
	find "${BUILD_DIR}" -type d ! -name build ! -path '**/ci' -delete 2>/dev/null || true
}

combine_javascript_sources() {
	cd "${BUILD_DIR}/${PKGNAME}/resources/js"
	cat _vendor/moment-with-locales.min.js \
		ThemeUtils.js \
		bootstrap.js > bundle.js
}

do_build() {
	cd "${BUILD_DIR}"

	# Compile Resources
	(combine_javascript_sources \
		&& pyrcc5 -o "${BUILD_DIR}/${PKGNAME}/resources.py" ../resources.qrc \
		&& cp "${BUILD_DIR}/${PKGNAME}/resources.py" "${REPO_DIR}/web-greeter")

	# Create "Zip Application"
	(cd "${PKGNAME}" \
		&& mv greeter.py __main__.py \
		&& zip -rq ../"${PKGNAME}.zip" . -x '**__pycache__**' 'resources/*' \
		&& cd - >/dev/null \
		&& mkdir -p "${INSTALL_ROOT}${PREFIX}"/{bin,share} \
		&& echo '#!/bin/python3' >> "${INSTALL_ROOT}${PREFIX}/bin/web-greeter" \
		&& cat web-greeter.zip >> "${INSTALL_ROOT}${PREFIX}/bin/web-greeter" \
		&& chmod +x "${INSTALL_ROOT}${PREFIX}/bin/web-greeter")
}

do_install() {
	[[ -e "${DESTDIR}" ]] || mkdir -p "${DESTDIR}"
	find "${INSTALL_ROOT}" -type f -name '.git*' -delete
	rm -rf "${INSTALL_ROOT}/usr/share/web-greeter/themes/default/.tx"
	cp -R "${INSTALL_ROOT}"/* "${DESTDIR}"
}

do_install_dev() {
	cp -RH "${REPO_DIR}/whither/whither" /usr/lib/python3.6/site-packages/
}

generate_pot_file() {
	REPO_ROOT="$(dirname "${REPO_DIR}")"
	xgettext --from-code UTF-8 -o "${REPO_ROOT}/po/web-greeter.pot" -d web-greeter "${REPO_ROOT}"/src/*.c
}

init_build_dir() {
	[[ -e "${BUILD_DIR}/web-greeter" ]] && rm -rf "${BUILD_DIR}/web-greeter"
	[[ -e "${BUILD_DIR}/dist" ]] && rm -rf "${BUILD_DIR}/dist"
	cp -R -t "${BUILD_DIR}" "${REPO_DIR}/web-greeter" "${REPO_DIR}/dist"
}

prepare_install() {
	cd "${BUILD_DIR}"
	mkdir -p \
		"${INSTALL_ROOT}${PREFIX}"/share/{man/man1,metainfo,web-greeter,xgreeters} \
		"${INSTALL_ROOT}/etc/lightdm"

	# Themes
	(cp -R "${REPO_DIR}/themes" "${INSTALL_ROOT}${PREFIX}/share/web-greeter" \
		&& cd "${INSTALL_ROOT}${PREFIX}/share/web-greeter" \
		&& mv themes/_vendor .)

	# Man Page
	cp "${BUILD_DIR}/dist/${PKGNAME}.1" "${INSTALL_ROOT}${PREFIX}/share/man/man1"

	# Greeter Config
	cp "${BUILD_DIR}/dist/${PKGNAME}.yml" "${INSTALL_ROOT}/etc/lightdm"

	# AppData File
	cp "${BUILD_DIR}/dist/com.antergos.${PKGNAME}.appdata.xml" "${INSTALL_ROOT}${PREFIX}/share/metainfo"

	# Desktop File
	cp "${BUILD_DIR}/dist/com.antergos.${PKGNAME}.desktop" "${INSTALL_ROOT}${PREFIX}/share/xgreeters"
}

set_config() {
	[[ -z "$1" || -z "$2" ]] && return 1

	sed -i "s|'@$1@'|$2|g" \
		"${BUILD_DIR}/web-greeter/whither.yml" \
		"${BUILD_DIR}/dist/web-greeter.yml"
}


# Catch Command Errors
trap '_handle_error ${LINENO} ${$?}' ERR

cd "${REPO_DIR}/build" >/dev/null

case "$1" in
	combine-js)
		combine_javascript_sources
	;;

	clean)
		clean_build_dir
	;;

	build)
		PREFIX="$2"
		do_build
	;;

	build-init)
		init_build_dir
	;;

	gen-pot)
		generate_pot_file
	;;

	install)
		DESTDIR="$2"
		PREFIX="$3"
		do_install
		clean_build_dir
	;;

	install-dev)
		do_install_dev
	;;

	prepare-install)
		PREFIX="$2"
		prepare_install
	;;

	set-config)
		set_config "$2" "$3"
	;;
esac
