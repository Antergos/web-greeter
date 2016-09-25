pkgg = import('pkgconfig')

configure_file(output: 'config.h', configuration: conf)

# ======================================= #
# ------->>> Webkit2 Extension <<<------- #
# ======================================= #

webext_sources = ['lightdm-webkit2-greeter-ext.c']

webext_incdir = include_directories('.')

webext_cargs = [
    '-DVERSION=@0@'.format(as_version),
    '-DLOCALE_DIR=@0@'.format(get_option('localedir'))
]

webext = shared_library(
    'lightdm-webkit2-greeter-webext',
    webext_sources,
    dependencies: webext_deps,
    c_args: webext_cargs,
    include_directories : webext_incdir,
    install: true)

pkgg.generate(
    version : as_version,
    libraries : webext,
    name : 'lightdm-webkit2-greeter-webext',
    description : 'WebKit web extension that allows the greeter to execute code inside the web process.',
    filebase : 'lightdm-webkit2-greeter',
    subddirs : 'lightdm-webkit2-greeter')


# ===================================== #
# ------->>> LightDM Greeter <<<------- #
# ===================================== #

greeter_sources = ['lightdm-webkit2-greeter.c']

greeter_incdir = include_directories('.')

extdir = '@0@/@1@'.format(get_option('libdir'), 'lightdm-webkit2-greeter')

greeter_cargs = [
    '-DLIGHTDM_WEBKIT2_GREETER_EXTENSIONS_DIR=@0@'.format(extdir),
    '-DVERSION=@0@'.format(as_version),
    '-DLOCALE_DIR=@0@'.format(get_option('localedir'))
]

greeter = executable(
    'lightdm-webkit2-greeter',
    sources: greeter_sources,
    include_directories: greeter_incdir,
    dependencies: deps,
    c_args: greeter_cargs)
