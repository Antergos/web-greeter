configure_file(output: 'config.h', configuration: conf)

gresource_sources = include_directories('gresource')
_ = get_option('with-webext-dir').split('"')
extdir = _[0]

# ======================================= #
# ------->>> Webkit2 Extension <<<------- #
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

greeter_sources = ['gresource/greeter-resources.c', 'greeter.c']

greeter = executable(
    'lightdm-webkit2-greeter',
    greeter_sources,
    dependencies: greeter_deps,
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
