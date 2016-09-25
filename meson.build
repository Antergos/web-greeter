project('lightdm-webkit2-greeter', 'c', version: '2.1.5', license: 'GPL-3')


# ================================== #
# ------->>> Version Vars <<<------- #
# ================================== #

as_version = meson.project_version()
version_parts = as_version.split('.')

as_major_version = version_parts[0]
as_minor_version = version_parts[1]
as_micro_version = version_parts[2]


# ======================================= #
# ------->>> Dependency Checks <<<------- #
# ======================================= #

dbus_glib = dependency('dbus-glib-1')

gtk3 = dependency('gtk+-3.0', version: '>=3.16')

libldm_gobject = dependency('liblightdm-gobject-1')

webkit2 = dependency('webkit2gtk-4.0', version: '>=2.10.7')

webkit2_webext = dependency('webkit2gtk-web-extension-4.0', version: '>=2.10.7')

x11 = dependency('x11')

deps = [dbus_glib, gtk3, libldm_gobject, webkit2, x11]
webext_deps = deps + [webkit2_webext]


# =================================== #
# ------->>> Configuration <<<------- #
# =================================== #

conf = configuration_data()

conf.set('VERSION', as_version)
conf.set('PACKAGE_VERSION', as_version)
conf.set('AS_MAJOR_VERSION', as_major_version)
conf.set('AS_MINOR_VERSION', as_minor_version)
conf.set('AS_MICRO_VERSION', as_micro_version)

conf.set('GETTEXT_PACKAGE', '"lightdm-webkit2-greeter"')

conf.set('LOCALE_DIR', '"@0@/@1@"'.format(get_option('datadir'), 'locale'))

conf.set('THEME_DIR', '"@0@"'.format(get_option('with-theme-dir')))

conf.set('CONFIG_DIR', '"@0@"'.format(get_option('with-config-dir')))

conf.set('DESKTOP_DIR', '"@0@"'.format(get_option('with-desktop-dir')))


# ===================================== #
# ------->>> Sub Directories <<<------- #
# ===================================== #

subdirs = ['src', 'man', 'themes', 'data']

foreach s : subdirs
  subdir(s)
endforeach

