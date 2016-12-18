configure_file(output: 'config.h', configuration: conf)

with_webext_dir = get_option('with-webext-dir').split('"')
extdir = with_webext_dir[0]

# ================================ #
# ------->>> GResources <<<------- #
# ================================ #

gresources_dir = include_directories('gresource')
gnome = import('gnome')
utils = '@0@/utils.sh'.format(meson.build_root())

# Can't do it the right way until GLib 2.52 is released
# js_sources = run_command(utils, 'get-js-files').stdout().split()

#js_sources_combined = custom_target(
#    'javascript_sources',
#    input: files(js_sources),
#    output: 'bundle.js',
#    command: [utils, 'combine-js']
#)

js_sources = run_command(utils, 'combine-js')

gresources = gnome.compile_resources(
    'greeter-resources',
    'gresource/greeter-resources.gresource.xml',
    source_dir: 'gresource',
    c_name: 'greeter_resources'
)

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

greeter_sources = [gresources, 'greeter.c']

greeter = executable(
    'lightdm-webkit2-greeter',
    greeter_sources,
    dependencies: greeter_deps,
    install: true
)

