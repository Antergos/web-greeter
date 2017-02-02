project('web-greeter', 'python', version: '3.0.0alpha1', license: 'GPL-3')

# ================================== #
# ------->>> Version Vars <<<------- #
# ================================== #

version = meson.project_version()
version_parts = as_version.split('.')

major_version = version_parts[0]
minor_version = version_parts[1]
micro_version = version_parts[2]


# ======================================= #
# ------->>> Dependency Checks <<<------- #
# ======================================= #

python_dep = join(meson.build_root(), 'python_dep.py')

dbus_glib       = dependency('dbus-glib-1')
lightdm_gobject = dependency('liblightdm-gobject-1')
x11             = dependency('x11')
web_engine      = dependency('qt5', modules: ['WebEngine', 'WebEngineWidgets', 'WebChannel'])


pyqt5_check = run_command(python_dep, 'PyQt5')

if pyqt5_check.return_code() == 0:
  pyqt5 = declare_dependency(version: pyqt5_check.stdout().strip())
else
  pyqt5 = declare_dependency(version: '0.0.1')
endif


yaml_check = run_command(python_dep, 'ruamel.yaml')

if yaml_check.return_code() == 0:
  yaml = declare_dependency(version: yaml_check.stdout().strip())
else
  yaml = declare_dependency(version: '0.0.1')
endif


python_dependencies = [
  ['pyqt5', pyqt5],
  ['ruamel.yaml', yaml]
]

foreach dep: python_dependencies
  if not dep.get(1).version().version_compare(>0.0.1):
    error('Missing Dependency: @0@'.format(dep.get(0)))
  endif
endforeach


greeter_deps       = [dbus_glib, lightdm_gobject, web_engine, x11]
has_lightdm_1_19_2 = lightdm_gobject.version().version_compare('>=1.19.2')


# =================================== #
# ------->>> Configuration <<<------- #
# =================================== #

conf        = configuration_data()
config_file = 'whither.yaml'
logo_image  = get_option('with-logo-image', join_paths(get_option('with-themes-dir'), 'antergos/img/antergos.png'))
user_image  = get_option('with-user-image', join_paths(get_option('with-themes-dir'), 'antergos/img/antergos-logo-user.png'))

conf.set('full_version', version)
conf.set('major_version', major_version)
conf.set('minor_version', minor_version)
conf.set('micro_version', micro_version)

conf.set('locale_dir', get_option('with-locale-dir'))

conf.set('themes_dir', get_option('with-themes-dir'))

conf.set('config_dir', get_option('with-config-dir'))

conf.set('greeters_dir', get_option('with-greeters-dir'))

conf.set('background_images_dir', get_option('with-background-images-dir'))

conf.set('logo_image', logo_image)

conf.set('user_image', user_image)

if has_lightdm_1_19_2
  conf.set('has_lightdm_1_19_2', 'True')
else
  conf.set('has_lightdm_1_19_2', 'False')
endif


# ===================================== #
# ------->>> Sub Directories <<<------- #
# ===================================== #

subdirs = ['web-greeter', 'man', 'themes', 'dist', 'po']

foreach s : subdirs
  subdir(s)
endforeach

