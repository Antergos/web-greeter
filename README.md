# lightdm-webkit2-greeter
[![Latest Release](https://img.shields.io/github/release/Antergos/web-greeter.svg?style=flat-square)](https://github.com/Antergos/web-greeter/releases)  &nbsp;[![CircleCI](https://img.shields.io/circleci/project/Antergos/web-greeter/stable.svg?style=flat-square)](https://circleci.com/gh/Antergos/web-greeter) &nbsp;[![Coverity Scan Build Status](https://img.shields.io/coverity/scan/6871.svg?style=flat-square)](https://scan.coverity.com/projects/antergos-lightdm-webkit2-greeter) &nbsp;[![Theme API Docs](https://img.shields.io/badge/API--Doc-ready-brightgreen.svg?style=flat-square)](https://doclets.io/Antergos/web-greeter/stable) &nbsp;[![AUR Votes](https://img.shields.io/aur/votes/lightdm-webkit2-greeter.svg?maxAge=2592000&style=flat-square)](https://aur.archlinux.org/packages/lightdm-webkit2-greeter)

## Install It

#### Official Distro Packages
|Distro|Install Command/Links|
|:---:|:---:|
|![antergos][antergos]|`sudo pacman -S lightdm-webkit2-greeter`|

#### Unofficial Distro Packages
|Distro|Install Command/Links|
|:---:|:---:|
|![arch][arch]|`yaourt -S lightdm-webkit2-greeter`|
|![fedora][fedora] |[copr](https://copr.fedorainfracloud.org/coprs/antergos/lightdm-webkit2-greeter/) &nbsp;\|&nbsp; [OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)|
|![openSUSE][openSUSE]|[1 Click Install](https://software.opensuse.org/ymp/home:antergos/openSUSE_Leap_42.1/lightdm-webkit2-greeter.ymp?base=openSUSE%3ALeap%3A42.1&query=lightdm-webkit2-greeter) &nbsp;\|&nbsp; [OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)|
|![ubuntu][ubuntu]|[OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)|

## Build It

### Dependencies
|                       | ![antergos][antergos] &nbsp;&nbsp; ![arch][arch] | ![debian][debian] &nbsp;&nbsp; ![ubuntu][ubuntu] | ![fedora][fedora]     | ![opensuse][opensuse]  | 
|-----------------------|--------------------------------------------------|--------------------------------------------------|-----------------------|------------------------|
|**liblightdm-gobject-1** |lightdm                                         |liblightdm-gobject-dev                            | lightdm-gobject-devel | liblightdm-gobject-1-0 |
|**gtk+ 3**               |gtk3                                            |libgtk-3-0                                        | gtk3                  | gtk3                   |
|**webkit2gtk-4.0**       |webkit2gtk                                      |libwebkit2gtk-4.0-dev                             | webkitgtk4            | libwebkit2gtk-4_0-37   |
|**dbus-glib-1**          |dbus-glib                                       |libdbus-glib-1-dev                                | dbus-glib             | dbus-1-glib            |

#### Build Deps
|                   | ![antergos][antergos] &nbsp;&nbsp; ![arch][arch] &nbsp;&nbsp; ![debian][debian] &nbsp;&nbsp; ![ubuntu][ubuntu] &nbsp;&nbsp; ![fedora][fedora] &nbsp;&nbsp; ![opensuse][opensuse] |
|-------------------|--------------------------------------------------|
|**Meson Build System**|meson v0.37+|

### How To Build
```sh
git clone https://github.com/Antergos/lightdm-webkit2-greeter.git /tmp/greeter
cd /tmp/greeter/build
git checkout ${LATEST_RELEASE_TAG} # eg. git checkout 2.2
meson --prefix=/usr --libdir=lib ..
ninja
```

### How To Install
```sh
sudo ninja install
```

## Theme JavaScript API:
The greeter exposes a JavaScript API to themes which they must use to interact with the greeter (in order to facilitate the user login process). For more details, check out the [API Documentation](https://doclets.io/Antergos/lightdm-webkit2-greeter/stable). 


## Translations
Translations are managed through [Transifex](https://www.transifex.com/faidoc/antergos/lightdm-webkit2-greeter/).


[antergos]: https://antergos.com/distro-logos/logo-square26x26.png "antergos"
[arch]: https://antergos.com/distro-logos/archlogo26x26.png "arch"
[fedora]: https://antergos.com/distro-logos/fedora-logo.png "fedora"
[openSUSE]: https://antergos.com/distro-logos/Geeko-button-bling7.png "openSUSE"
[ubuntu]: https://antergos.com/distro-logos/ubuntu_orange_hex.png "ubuntu"
[debian]: https://antergos.com/distro-logos/openlogo-nd-25.png "debian"

[release]: https://img.shields.io/github/release/Antergos/web-greeter.svg?style=flat-square "Latest Release"
[codacy]: https://img.shields.io/codacy/grade/43c95c8c0e3749b8afa3bfd2b6edf541.svg?style=flat-square "Codacy Grade"
[circleci]: https://img.shields.io/circleci/project/Antergos/web-greeter/master.svg?style=flat-square "CI Status"
[api]: https://img.shields.io/badge/API--Docs-ready-brightgreen.svg?style=flat-square "Theme API Docs"
[aur]: https://img.shields.io/aur/votes/lightdm-webkit2-greeter.svg?maxAge=604800&style=flat-square "AUR Votes"

[whither]: https://github.com/Antergos/whither "Whither"
