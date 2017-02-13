# lightdm-webkit-theme-antergos



### Overview

This is the default theme included with [web-greeter](http://github.com/Antergos/web-greeter). If you are using the Webkit2 greeter, you already have this theme.

### Screenshots
<center>
<img src="img/screenshot1.jpg" alt="screenshot1" />
<hr/>
<img src="img/screenshot2.jpg" alt="screenshot2" />
<hr/>
<img src="img/screenshot3.jpg" alt="screenshot3" />
</center>

### Prerequisites
* web-greeter

### Installation
This theme is included with `web-greeter` which is installed by default for Antergos users. Non-Antergos users should see [web-greeter](https://github.com/Antergos/web-greeter/) for installation details.

### User Icons Management

To change users icons:

* Create a resource named with the user's login in `/var/lib/AccountsService/icons/`
* Edit `/var/lib/AccountsService/users/<userLogin>` and add a property `Icon` targeting the icon resource you just created.

## Theme JavaScript API:
The greeter exposes a JavaScript API to themes which they must use to interact with the greeter (in order to facilitate the user login process). For more details, check out the [API Documentation](https://doclets.io/Antergos/web-greeter/master). 


## Translations
Translations are managed through [Transifex](http://transifex.com).

