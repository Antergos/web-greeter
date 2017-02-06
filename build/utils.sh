#!/bin/bash

BUILD_DIR="$(realpath $(dirname "${BASH_SOURCE[0]}"))"
REPO_DIR="$(dirname "${BUILD_DIR}")"
INSTALL_ROOT="${BUILD_DIR}/install_root"
PKGNAME='web-greeter'
DESTDIR=''


_handle_error() {
	LASTLINE="$1"
	LASTERR="$2"
	echo "${BASH_SOURCE[0]}: line ${LASTLINE}: exit status of last command: ${LASTERR}"
	exit 1
}

clean_build_dir() {
	find "${BUILD_DIR}" -type f ! -path '*/ci/*' ! -name utils.sh -delete
	find "${BUILD_DIR}" -type d ! -name build ! -path '*/ci' -delete
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
		&& pyrcc5 -o ../../resources.py ../resources.qrc)

	# Create "Zip Application"
	(cd "${PKGNAME}" \
		&& mv greeter.py __main__.py \
		&& zip -rq ../"${PKGNAME}.zip" . -x '**__pycache__**' 'resources/*' \
		&& cd - >/dev/null \
		&& mkdir -p "${INSTALL_ROOT}"/usr/{bin,share} \
		&& echo '#!/bin/python' >> "${INSTALL_ROOT}/usr/bin/web-greeter" \
		&& cat web-greeter.zip >> "${INSTALL_ROOT}/usr/bin/web-greeter" \
		&& chmod +x "${INSTALL_ROOT}/usr/bin/web-greeter")
}

do_install() {
	cd "${BUILD_DIR}"
	mkdir -p \
		"${INSTALL_ROOT}"/usr/share/{man/man1,metainfo,web-greeter,xgreeters} \
		"${INSTALL_ROOT}/etc/lightdm"

	# Themes
	(cp -R "${REPO_DIR}/themes" "${INSTALL_ROOT}/usr/share/web-greeter" \
		&& cd "${INSTALL_ROOT}/usr/share/web-greeter" \
		&& mv themes/_vendor .)

	# Man Page
	cp "${REPO_DIR}/dist/${PKGNAME}.1" "${INSTALL_ROOT}/usr/share/man/man1"

	# Greeter Config
	cp "${REPO_DIR}/dist/${PKGNAME}.conf" "${INSTALL_ROOT}/etc/lightdm"

	# AppData File
	cp "${REPO_DIR}/dist/com.antergos.${PKGNAME}.appdata.xml" "${INSTALL_ROOT}/usr/share/metainfo"

	# Desktop File
	cp "${REPO_DIR}/dist/com.antergos.${PKGNAME}.desktop" "${INSTALL_ROOT}/usr/share/xgreeters"

	# Do Install!
	[[ -e "${DESTDIR}" ]] || mkdir -p "${DESTDIR}"
	cp -R "${INSTALL_ROOT}"/* "${DESTDIR}"

	# Fix Permissions
	chown -R "${SUDO_UID}:${SUDO_GID}" "${BUILD_DIR}"
}

do_success() {
	NO_COLOR=\x1b[0m
	SUCCESS_COLOR=\x1b[32;01m
	SUCCESS="${SUCCESS_COLOR}[SUCCESS!]${NO_COLOR}"
	echo "${SUCCESS}"
}

generate_pot_file() {
	REPO_ROOT="$(dirname "${REPO_DIR}")"
	xgettext --from-code UTF-8 -o "${REPO_ROOT}/po/lightdm-webkit2-greeter.pot" -d lightdm-webkit2-greeter "${REPO_ROOT}"/src/*.c
}

init_build_dir() {
	[[ -e "${BUILD_DIR}/web-greeter" ]] && return 0
	cp -R "${REPO_DIR}/web-greeter" "${BUILD_DIR}"
}

set_config() {
	( [[ -z "$1" ]] || [[ -z "$2" && -z "$3" ]] ) && return 1
	local KEY VALUE

	KEY="$1"
	[[ '' != "$2" ]] && VALUE="$2" || VALUE="$3"

	sed -i "s|@${KEY}@|@${VALUE}@|g" "${BUILD_DIR}/web-greeter/whither.yml"
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
		do_install
	;;

	set-config)
		set_config "$2" "$3" "$4"
	;;
esac
