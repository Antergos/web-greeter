# Web Greeter for LightDM
[![Latest Release](https://img.shields.io/github/release/Antergos/lightdm-webkit2-greeter.svg?style=flat-square)](https://github.com/Antergos/lightdm-webkit2-greeter/releases)  &nbsp;[![CircleCI](https://img.shields.io/circleci/project/Antergos/lightdm-webkit2-greeter/master.svg?style=flat-square)](https://circleci.com/gh/Antergos/lightdm-webkit2-greeter) &nbsp;[![Coverity Scan Build Status](https://img.shields.io/coverity/scan/6871.svg?style=flat-square)](https://scan.coverity.com/projects/antergos-lightdm-webkit2-greeter) &nbsp;[![Theme API Docs](https://img.shields.io/badge/API--Doc-ready-brightgreen.svg?style=flat-square)](https://doclets.io/Antergos/lightdm-webkit2-greeter/stable) &nbsp;[![AUR Votes](https://img.shields.io/aur/votes/lightdm-webkit2-greeter.svg?maxAge=2592000&style=flat-square)](https://aur.archlinux.org/packages/lightdm-webkit2-greeter)

## Install It

#### Official Distro Packages
|Distro|Install Command/Links|
|:---:|:---:|
|![antergos](https://dl.dropboxusercontent.com/u/60521097/logo-square26x26.png)|`sudo pacman -S lightdm-webkit2-greeter`|

#### Unofficial Distro Packages
|Distro|Install Command/Links|
|:---:|:---:|
|![arch](https://dl.dropboxusercontent.com/u/60521097/archlogo26x26.png)|`yaourt -S lightdm-webkit2-greeter`|
|![fedora](https://dl.dropboxusercontent.com/u/60521097/fedora-logo.png)|[copr](https://copr.fedorainfracloud.org/coprs/antergos/lightdm-webkit2-greeter/) &nbsp;\|&nbsp; [OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)|
|![openSUSE](https://dl.dropboxusercontent.com/u/60521097/Geeko-button-bling7.png)|[1 Click Install](https://software.opensuse.org/ymp/home:antergos/openSUSE_Leap_42.1/lightdm-webkit2-greeter.ymp?base=openSUSE%3ALeap%3A42.1&query=lightdm-webkit2-greeter) &nbsp;\|&nbsp; [OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)|
|![ubuntu](https://dl.dropboxusercontent.com/u/60521097/ubuntu_orange_hex.png)|[OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)|

## Install It Manually

### Dependencies
|                       | ![antergos](https://dl.dropboxusercontent.com/u/60521097/logo-square26x26.png) &nbsp;&nbsp; ![arch](https://dl.dropboxusercontent.com/u/60521097/archlogo26x26.png) | ![debian](https://dl.dropboxusercontent.com/u/60521097/openlogo-nd-25.png) &nbsp;&nbsp; ![ubuntu](https://dl.dropboxusercontent.com/u/60521097/ubuntu_orange_hex.png) | ![fedora](https://dl.dropboxusercontent.com/u/60521097/fedora-logo.png) | ![openSUSE](https://dl.dropboxusercontent.com/u/60521097/Geeko-button-bling7.png) | 
|-----------------------|-------------------------------------------------------------------------|----------------------------------------------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
|**whither**            |python-whither|python3-whither       |python3-whither      |python3-whither       |
|**liblightdm-gobject** |lightdm       |liblightdm-gobject-dev|lightdm-gobject-devel|liblightdm-gobject-1-0|
|**pygobject**          |python-gobject|python3-gi            |pygobject3           |python3-gobject       |
|**pyqt5**              |python-pyqt5  |python3-pyqt5         |python3-qt5          |python3-qt5           |
|**qt5-webengine**      |qt5-webengine |libqt5webengine5      |qt5-qtwebengine      |libqt5-qtwebengine    |

> ***NOTE:*** These instructions are for the `master` branch. To build the latest release, please see the `stable` branch.

```sh
git clone https://github.com/Antergos/lightdm-webkit2-greeter.git /tmp/greeter
cd /tmp/greeter
sudo make install
```

## Theme JavaScript API:
The greeter exposes a JavaScript API to themes which they must use to interact with the greeter (in order to facilitate the user login process). For more details, check out the [API Documentation](https://doclets.io/Antergos/lightdm-webkit2-greeter/stable). 


## Translations
Translations are managed through [Transifex](https://www.transifex.com/faidoc/antergos/lightdm-webkit2-greeter/).
