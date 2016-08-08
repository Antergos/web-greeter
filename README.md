# lightdm-webkit2-greeter
[![Latest Release](https://img.shields.io/github/release/Antergos/lightdm-webkit2-greeter.svg?style=flat-square)](https://github.com/Antergos/lightdm-webkit2-greeter/releases)  &nbsp;[![Coverity Scan Build Status](https://img.shields.io/coverity/scan/6871.svg?style=flat-square)](https://scan.coverity.com/projects/antergos-lightdm-webkit2-greeter) &nbsp;[![AUR Votes](https://img.shields.io/aur/votes/lightdm-webkit2-greeter.svg?maxAge=2592000&style=flat-square)](https://aur.archlinux.org/packages/lightdm-webkit2-greeter)

## Install It

#### Official Distro Packages
* ![antergos](https://dl.dropboxusercontent.com/u/60521097/logo-square26x26.png)&nbsp; `sudo pacman -S lightdm-webkit2-greeter`

#### Unofficial Distro Packages
* ![arch](https://dl.dropboxusercontent.com/u/60521097/archlogo26x26.png)&nbsp; `yaourt -S lightdm-webkit2-greeter`
* ![fedora](https://dl.dropboxusercontent.com/u/60521097/fedora-logo.png)&nbsp; [copr](https://copr.fedorainfracloud.org/coprs/antergos/lightdm-webkit2-greeter/) &nbsp;|&nbsp; [OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)
* ![openSUSE](https://dl.dropboxusercontent.com/u/60521097/Geeko-button-bling7.png)&nbsp; [1 Click Install](https://software.opensuse.org/ymp/home:antergos/openSUSE_Leap_42.1/lightdm-webkit2-greeter.ymp?base=openSUSE%3ALeap%3A42.1&query=lightdm-webkit2-greeter) &nbsp;|&nbsp; [OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)
* ![ubuntu](https://dl.dropboxusercontent.com/u/60521097/ubuntu_orange_hex.png) &nbsp;[OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)

## Build It

#### Dependencies
|                   | ![antergos](https://dl.dropboxusercontent.com/u/60521097/logo-square26x26.png) &nbsp; &nbsp; ![arch](https://dl.dropboxusercontent.com/u/60521097/archlogo26x26.png) | ![debian](https://dl.dropboxusercontent.com/u/60521097/openlogo-nd-25.png) &nbsp;&nbsp; ![ubuntu](https://dl.dropboxusercontent.com/u/60521097/ubuntu_orange_hex.png) | ![fedora](https://dl.dropboxusercontent.com/u/60521097/fedora-logo.png) | ![openSUSE](https://dl.dropboxusercontent.com/u/60521097/Geeko-button-bling7.png) | 
|-----------------------|-------------------------------------------------------------------------|----------------------------------------------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
|**liblightdm-gobject-1** |lightdm  |liblightdm-gobject-dev | lightdm-gobject-devel | liblightdm-gobject-1-0 |
|**gtk+ 3**               |gtk3     |libgtk-3-0             | gtk3                  | gtk3                   |
|**webkit2gtk-4.0**       |webkit2gtk|libwebkit2gtk-4.0-dev  | webkitgtk4            | libwebkit2gtk-4_0-37            |
|**dbus-glib-1**         |dbus-glib|libdbus-glib-1-dev     | dbus-glib             | dbus-1-glib            |
|**exo-csource**          |exo      |exo-utils              | exo-devel             | exo-tools              |

#### How To Build
```sh
cd /tmp
git clone https://github.com/Antergos/lightdm-webkit2-greeter.git greeter
cd greeter
git checkout <tag for latest release> # eg. git checkout 2.1.4
./autogen.sh --prefix=/usr
make
```

#### How To Install
```sh
sudo make install --prefix=/usr
```

## Theme JavaScript API:
The greeter exposes a JavaScript API to themes which they must use to interact with the greeter (in order to facilitate the user login process). For more details, check out the [API Documentation](https://doclets.io/Antergos/lightdm-webkit2-greeter/master). 


## Translations
Translations are managed through [Transifex](http://transifex.com).
