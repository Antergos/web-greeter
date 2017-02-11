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
import os
from typing import (
    ClassVar,
    Type,
)

# 3rd-Party Libs
from whither.app import App
from whither.base.data import AttributeDict
from whither.base.config_loader import ConfigLoader
from whither.bridge import BridgeObject

# This Application
import resources
from bridge import (
    Config,
    Greeter,
    ThemeUtils,
)

# Typing Helpers
BridgeObj = Type[BridgeObject]


BASE_DIR = os.path.dirname(os.path.realpath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, 'whither.yml')


class WebGreeter(App):
    greeter = None         # type: ClassVar[BridgeObj]
    greeter_config = None  # type: ClassVar[BridgeObj]
    theme_utils = None     # type: ClassVar[BridgeObj]

    def __init__(self, *args, **kwargs):
        super().__init__('WebGreeter', *args, **kwargs)

        self.greeter = Greeter(self.config.themes_dir)
        self.greeter_config = Config(self.config)
        self.theme_utils = ThemeUtils(self.greeter, self.config)
        self._web_container.bridge_objects = (self.greeter, self.greeter_config, self.theme_utils)

        self._web_container.initialize_bridge_objects()
        self._web_container.load_script(':/_greeter/js/bundle.js', 'Web Greeter Bundle')
        self.load_theme()

    def _before_web_container_init(self):
        self.get_and_apply_user_config()

    def get_and_apply_user_config(self):
        config_file = os.path.join(self.config.config_dir, 'web-greeter.yml')
        branding_config = ConfigLoader('branding', config_file).config
        greeter_config = ConfigLoader('greeter', config_file).config

        self.config.branding.update(branding_config)
        self.config.greeter.update(greeter_config)

    def load_theme(self):
        theme_url = f'/{self.config.themes_dir}/{self.config.greeter.theme}/index.html'
        self._web_container.load(theme_url)


if __name__ == '__main__':
    greeter = WebGreeter()

    greeter.run()
