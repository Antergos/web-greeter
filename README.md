# Web Greeter for LightDM
[![Latest Release][release]](https://github.com/Antergos/web-greeter/releases)  &nbsp;[![Codacy Grade][codacy]](https://www.codacy.com/app/Antergos/web-greeter) &nbsp;[![CircleCI][circleci]](https://circleci.com/gh/Antergos/web-greeter) &nbsp;[![Theme API Docs][api]](https://doclets.io/Antergos/web-greeter/stable) &nbsp;[![AUR Votes][aur]](https://aur.archlinux.org/packages/lightdm-webkit2-greeter)

## Install It

### Distro Packages
|Distro|Install Command/Links|
|:---:|:---:|
|![antergos][antergos]|`sudo pacman -S lightdm-webkit2-greeter`|
|![arch][arch]        |`yaourt -S lightdm-webkit2-greeter`|
|![fedora][fedora]    |`dnf copr enable antergos/lightdm-webkit2-greeter`|
|![openSUSE][openSUSE]|[1 Click Install](https://software.opensuse.org/ymp/home:antergos/openSUSE_Leap_42.2/lightdm-webkit2-greeter.ymp?base=openSUSE%3ALeap%3A42.2&query=lightdm-webkit2-greeter)|
|![ubuntu][ubuntu]    |[OBS Repo](https://software.opensuse.org/download.html?project=home:antergos&package=lightdm-webkit2-greeter)|

### From Source

#### Dependencies
|                       | ![antergos][antergos] &nbsp;&nbsp; ![arch][arch] | ![ubuntu][ubuntu]    | ![fedora][fedora]   | ![openSUSE][openSUSE] | 
|-----------------------|--------------------------------------------------|----------------------|---------------------|-----------------------|
|**whither**            |python-whither                                    |python3-whither       |python3-whither      |python3-whither        |
|**liblightdm-gobject** |lightdm                                           |liblightdm-gobject-dev|lightdm-gobject-devel|liblightdm-gobject-1-0 |
|**pygobject**          |python-gobject                                    |python3-gi            |pygobject3           |python3-gobject        |

> ***NOTE:*** These instructions are for the `master` branch. To build the latest release, please see the `stable` branch.

#### Download & Install
```sh
git clone https://github.com/Antergos/web-greeter.git /tmp/greeter
cd /tmp/greeter
sudo make install
```

## Theme JavaScript API:
The greeter exposes a JavaScript API to themes which they must use to interact with the greeter (in order to facilitate the user login process). For more details, check out the [API Documentation](https://doclets.io/Antergos/web-greeter/stable). 


## Translations
Translations are managed through [Transifex](https://www.transifex.com/faidoc/antergos/lightdm-webkit2-greeter/).


[antergos]: https://dl.dropboxusercontent.com/u/60521097/logo-square26x26.png "antergos"
[arch]: https://dl.dropboxusercontent.com/u/60521097/archlogo26x26.png "arch"
[fedora]: https://dl.dropboxusercontent.com/u/60521097/fedora-logo.png "fedora"
[openSUSE]: https://dl.dropboxusercontent.com/u/60521097/Geeko-button-bling7.png "openSUSE"
[ubuntu]: https://dl.dropboxusercontent.com/u/60521097/ubuntu_orange_hex.png "ubuntu"

[release]: https://img.shields.io/github/release/Antergos/web-greeter.svg?style=flat-square "Latest Release"
[codacy]: https://img.shields.io/codacy/grade/43c95c8c0e3749b8afa3bfd2b6edf541.svg?style=flat-square "Codacy Grade"
[circleci]: https://img.shields.io/circleci/project/Antergos/web-greeter/master.svg?style=flat-square "CI Status"
[api]: https://img.shields.io/badge/API--Docs-ready-brightgreen.svg?style=flat-square "Theme API Docs"
[aur]: https://img.shields.io/aur/votes/lightdm-webkit2-greeter.svg?maxAge=604800&style=flat-square "AUR Votes"
