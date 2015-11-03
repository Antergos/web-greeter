# lightdm-webkit2-greeter
[![Latest Release](https://img.shields.io/github/release/Antergos/lightdm-webkit2-greeter.svg?style=flat-square)](https://github.com/Antergos/lightdm-webkit2-greeter/release)     [![Coverity Scan Build Status](https://img.shields.io/coverity/scan/6871.svg?style=flat-square)](https://scan.coverity.com/projects/antergos-lightdm-webkit2-greeter)

### Dependencies
- liblightdm-gobject-1
  - lightdm (Arch)
  - liblightdm-gobject-1 (Ubuntu)
- gtk+-3.0
- webkit2gtk-4.0
  - webkitgtk (Arch)
  - libwebkit2gtk (Ubuntu)
- dbus-glib-1

### Build Dependencies
 - exo-csource
   - exo (Arch)
   - libexo (Ubuntu)

### How To Build
The process is slightly different depending on how you obtain the source.

#### Use Git To Clone This Repo
```sh
git clone https://github.com/Antergos/lightdm-webkit2-greeter.git greeter
cd greeter
git submodule init
./autogen.sh --prefix=/usr
make
sudo make install
```

#### Download Repo In Archive Format (tar.gz, zip, etc)
```sh
wget https://github.com/Antergos/lightdm-webkit2-greeter/archive/master.zip
unzip master.zip
cd lightdm-webkit2-greeter-master/themes
rm -rf antergos
wget https://github.com/Antergos/lightdm-webkit-theme-antergos/archive/master.zip
unzip master.zip
mv lightdm** antergos
cd ../../
./autogen.sh --prefix=/usr
make
sudo make install
```



