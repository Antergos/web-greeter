configure_file(output: 'config.h', configuration: conf)

gresource_sources = include_directories('gresource')
extdir = '@0@/@1@'.format(get_option('libdir'), 'lightdm-webkit2-greeter')

# ======================================= #
# ------->>> Webkit2 Extension <<<------- #
# ======================================= #

webext_sources = ['gresource/greeter-resources.c', 'webkit2-extension.c']

webext = shared_library(
    'lightdm-webkit2-greeter-webext',
    webext_sources,
    dependencies: webext_deps,
    include_directories : gresource_sources,
    install: true,
    install_dir : extdir
)


# ============================= #
# ------->>> Greeter <<<------- #
# ============================= #

greeter_sources = ['gresource/greeter-resources.c', 'greeter.c']

greeter_cargs = [
    '-DLIGHTDM_WEBKIT2_GREETER_EXTENSIONS_DIR="@0@"'.format(extdir)
]

greeter = executable(
    'lightdm-webkit2-greeter',
    greeter_sources,
    dependencies: deps,
    c_args: greeter_cargs,
    include_directories : gresource_sources,
    install: true
)


# ===================================== #
# ------->>> Sub Directories <<<------- #
# ===================================== #

subdirs = ['gresource']

foreach s : subdirs
  subdir(s)
endforeach
