# ================================ #
# ------->>> Resources <<<-------- #
# ================================ #

resource_dir = include_directories('resource')
qt5 = import('qt5')
utils = '@0@/utils.sh'.format(meson.build_root())

js_sources = run_command(utils, 'combine-js')




# ======================================= #
# ------->>> WebKit2 Extension <<<------- #
# ======================================= #

webext_sources = ['webkit2-extension.c']

webext = library(
    'lightdm-webkit2-greeter-webext',
    webext_sources,
    dependencies: webext_deps,
    install: true,
    install_dir : extdir
)


# ============================= #
# ------->>> Greeter <<<------- #
# ============================= #

greeter_sources = [gresources, 'greeter.c', 'greeter-config.c']

greeter = executable(
    'lightdm-webkit2-greeter',
    greeter_sources,
    dependencies: greeter_deps,
    install: true
)

