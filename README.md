# lightdm-webkit2-greeter
[![Latest Release](https://img.shields.io/github/release/Antergos/lightdm-webkit2-greeter.svg?style=flat-square)](https://github.com/Antergos/lightdm-webkit2-greeter/releases)     [![Coverity Scan Build Status](https://img.shields.io/coverity/scan/6871.svg?style=flat-square)](https://scan.coverity.com/projects/antergos-lightdm-webkit2-greeter)

### Dependencies
| Name | Arch Pkg | Ubuntu Pkg |
|-------|---------|-----------|
|liblightdm-gobject-1|lightdm|liblightdm-gobject-1|
|gtk+ 3|gtk3|libgtk-3-0|
|webkit2gtk-4.0|webkitgtk|libwebkit2gtk|
|dbus-glib-1|dbus-glib|dbus-glib|
|[antergos-wallpapers](http://antergos.com/antergos-wallpapers-0.6.zip)|antergos-wallpapers|N/A|
- Notes:
  - antergos-wallpapers should be installed to `/usr/share/antergos/wallpapers`

### Build Dependencies
| Name | Arch Pkg | Ubuntu Pkg |
|-------|---------|-----------|
|exo-csource|exo|libexo|

### How To Build
The process is slightly different depending on how you obtain the source.

#### Use Git To Clone This Repo
```sh
git clone https://github.com/Antergos/lightdm-webkit2-greeter.git greeter
cd greeter
git submodule init && git submodule update
./autogen.sh --prefix=/usr
make
sudo make install
```

#### Download Repo In Archive Format (tar.gz, zip, etc)
```sh
wget https://github.com/Antergos/lightdm-webkit2-greeter/archive/master.zip
unzip master.zip
cd lightdm-web**/themes
rm -rf antergos
wget https://github.com/Antergos/lightdm-webkit-theme-antergos/archive/master.zip
unzip master.zip
mv lightdm** antergos
cd ..
./autogen.sh --prefix=/usr
make
sudo make install
```
### Theme JavaScript API:
The greeter exposes a JavaScript API to greeter themes which they must use to interact with the greeter (in order to facilitate the user login process). The [API Documentation](https://antergos.com/wiki/development/lightdm-webkit2-greeter-theme-javascript-api/) is a W.I.P. 
