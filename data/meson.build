id           = 'com.antergos.webkit2-greeter'
appdata_file = '@0@.appdata.xml'.format(id)
desktop_file = '@0@.desktop'.format(id)


install_data(
  desktop_file,
  install_dir: get_option('with-desktop-dir')
)

install_data(
  'webkit2-greeter.conf',
  install_dir: get_option('with-config-dir')
)

install_data(
  appdata_file,
  install_dir: join_paths(get_option('datadir'), 'metainfo', appdata_file)
)
