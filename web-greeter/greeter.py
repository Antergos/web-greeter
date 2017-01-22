#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  greeter.py
#
#  Copyright © 2017 Antergos
#
#  This file is part of Web Greeter.
#
#  Web Greeter is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 3 of the License, or
#  (at your option) any later version.
#
#  Web Greeter is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  The following additional terms are in effect as per Section 7 of the license:
#
#  The preservation of all legal notices and author attributions in
#  the material or in the Appropriate Legal Notices displayed
#  by works containing it is required.
#
#  You should have received a copy of the GNU General Public License
#  along with Web Greeter; If not, see <http://www.gnu.org/licenses/>.

# Standard Lib
import configparser
import os

# 3rd-Party Libs
from whither.app import App
from whither.base.data import AttributeDict

# This Application
from bridge.Greeter import Greeter


BASE_DIR = os.path.dirname(os.path.realpath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, 'whither.yml')


class WebGreeter(App):
    _user_config = AttributeDict({})
    _greeter = None

    def __init__(self, *args, **kwargs):
        super().__init__('WebGreeter', config_file=CONFIG_FILE, debug=True, *args, **kwargs)
        self.get_and_save_user_config()

        self._greeter = Greeter()
        self._web_container.bridge_objects = (self._greeter,)

        self._web_container.initialize_bridge_objects()
        self.load_theme()

    def get_and_save_user_config(self):
        config = configparser.ConfigParser()

        config.read('/etc/lightdm/web-greeter.conf')

        for section in config.sections():
            self._user_config[section] = {}

            for key in config[section]:
                self._user_config[section][key] = config[section][key]

    def load_theme(self):
        theme_url = 'file://{0}/{1}/index.html'.format(
            self.config.themes_dir,
            self._user_config.greeter.webkit_theme
        )

        self._web_container.load(theme_url)


if __name__ == '__main__':
    greeter = WebGreeter()

    greeter.run()
