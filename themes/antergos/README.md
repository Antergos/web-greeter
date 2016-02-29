# lightdm-webkit-theme-antergos
[![Latest Release](https://img.shields.io/github/release/Antergos/lightdm-webkit-theme-antergos.svg)](https://github.com/Antergos/lightdm-webkit-theme-antergos/releases/tag/2.3.0) [![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/Antergos/lightdm-webkit2-greeter/blob/master/LICENSE)


### Overview

This is the default theme included with [lightdm-webkit2-greeter](http://github.com/Antergos/lightdm-webkit2-greeter). If you are using the Webkit2 greeter, you already have this theme. The theme can also be used with the legacy Webkit1 greeter.

### Screenshots
<center>
<img src="img/screenshot1.jpg" alt="screenshot1" />
<hr/>
<img src="img/screenshot2.jpg" alt="screenshot2" />
<hr/>
<img src="img/screenshot3.jpg" alt="screenshot3" />
</center>

### Prerequisites
* lightdm-webkit-greeter

### Installation
Antergos users have this theme installed by default. It can be reinstalled using pacman if needed. Arch users can install [lightdm-webkit2-greeter](https://aur.archlinux.org/packages/lightdm-webkit2-greeter/) from the AUR.

To use this theme with the legacy Webkit1 greeter:

1. Download [Antergos Theme](https://github.com/Antergos/lightdm-webkit-theme-antergos/zipball/master)
2. Unzip it. This should create a folder named like `Antergos-lightdm-webkit-theme-antergos-28c4b13`.
3. Rename this folder to `antergos` and copy move it to the themes directory (so that the complete path becomes `/usr/share/lightdm-webkit/themes/antergos`)
4. Edit  `/etc/lightdm/lightdm-webkit2-greeter.conf` and set the `webkit-theme` property to `antergos`:

```
[greeter]
webkit-theme=antergos

```

Optionally you can install the included font `Lato`.

Now if you restart your computer (or at least if you restart lightdm), the antergos greeter theme should be activated. 


### User Icons Management

To change users icons:

* Create a resource named with the user's login in `/var/lib/AccountsService/icons/`
* Edit `/var/lib/AccountsService/users/<userLogin>` and add a property `Icon` targeting the icon resource you just created.

This theme works well with 96x96 images.

### Translations

Translations are managed through [Transifex](https://www.transifex.com/faidoc/antergos). Please do not submit PR for translations.

