appdata_file = 'com.antergos.lightdm-webkit2-greeter.appdata.xml'

install_data(
  'com.antergos.lightdm-webkit2-greeter.desktop',
  install_dir: get_option('with-desktop-dir')
)

install_data(
  'lightdm-webkit2-greeter.conf',
  install_dir: get_option('with-config-dir')
)

install_data(
  appdata_file,
  install_dir: join_paths(get_option('datadir'), 'metainfo', appdata_file)
)
