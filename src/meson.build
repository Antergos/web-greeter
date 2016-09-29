configure_file(output: 'config.h', configuration: conf)

# ======================================= #
# ------->>> Webkit2 Extension <<<------- #
# ======================================= #

webext_sources = ['webkit2-extension.c']

webext_incdir = include_directories('.')

webext = shared_library(
    'lightdm-webkit2-greeter-webext',
    webext_sources,
    dependencies: webext_deps,
    include_directories : webext_incdir,
    install: true)


# ============================= #
# ------->>> Greeter <<<------- #
# ============================= #

greeter_sources = ['greeter-resources.c', 'greeter.c']
gresource_sources = include_directories('gresource')

extdir = '"@0@/@1@"'.format(get_option('libdir'), 'lightdm-webkit2-greeter')

greeter_cargs = [
    '-DLIGHTDM_WEBKIT2_GREETER_EXTENSIONS_DIR=@0@'.format(extdir)
]

greeter = executable(
    'lightdm-webkit2-greeter',
    greeter_sources,
    dependencies: deps,
    c_args: greeter_cargs,
    install: true)


# ===================================== #
# ------->>> Sub Directories <<<------- #
# ===================================== #

subdirs = ['gresource']

foreach s : subdirs
  subdir(s)
endforeach
