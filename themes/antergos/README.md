# lightdm-webkit-theme-antergos



### Overview

This is the default theme included with [lightdm-webkit2-greeter](http://github.com/Antergos/lightdm-webkit2-greeter). If you are using the Webkit2 greeter, you already have this theme.

### Screenshots
<center>
<img src="img/screenshot1.jpg" alt="screenshot1" />
<hr/>
<img src="img/screenshot2.jpg" alt="screenshot2" />
<hr/>
<img src="img/screenshot3.jpg" alt="screenshot3" />
</center>

### Prerequisites
* lightdm-webkit2-greeter

### Installation
This theme is included with `lightdm-webkit2-greeter` which is installed by default for Antergos users. Non-Antergos users should see [lightdm-webkit2-greeter](https://github.com/Antergos/lightdm-webkit2-greeter/) for installation details.

### User Icons Management

To change users icons:

* Create a resource named with the user's login in `/var/lib/AccountsService/icons/`
* Edit `/var/lib/AccountsService/users/<userLogin>` and add a property `Icon` targeting the icon resource you just created.

### Translations

Translations are managed through [Transifex](https://www.transifex.com/faidoc/antergos). Please do not submit PR for translations.

### Webkit2 Greeter's Theme JavaScript API:
The greeter exposes a JavaScript API to greeter themes which they must use to interact with the greeter (in order to facilitate the user login process). The [API Documentation](https://antergos.com/wiki/development/lightdm-webkit2-greeter-theme-javascript-api/) is a W.I.P.

