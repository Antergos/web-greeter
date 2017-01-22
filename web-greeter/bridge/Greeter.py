#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  LightDMGreeter.py
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

# 3rd-Party Libs
import gi
gi.require_version('LightDM', '1')
from gi.repository import LightDM
from PyQt5.QtCore import QVariant
from whither.bridge import BridgeObject, prop

# This Application
from . import (
    language_to_dict,
    layout_to_dict,
    session_to_dict,
    user_to_dict,
)


LightDMGreeter = LightDM.Greeter()
LightDMUserList = LightDM.UserList()


class Greeter(BridgeObject):

    def __init__(self, *args, **kwargs):
        super().__init__(name='LightDMGreeter', *args, **kwargs)

    @prop(str)
    def authentication_user(self):
        return LightDMGreeter.get_authentication_user() or ''

    @prop(bool)
    def autologin_guest(self):
        return LightDMGreeter.get_autologin_guest_hint()

    @prop(int)
    def autologin_timeout(self):
        return LightDMGreeter.get_autologin_timeout_hint()

    @prop(str)
    def autologin_user(self):
        return LightDMGreeter.get_autologin_user_hint()

    @prop(bool)
    def can_hibernate(self):
        return LightDM.get_can_hibernate()

    @prop(bool)
    def can_restart(self):
        return LightDM.get_can_restart()

    @prop(bool)
    def can_shutdown(self):
        return LightDM.get_can_shutdown()

    @prop(bool)
    def can_suspend(self):
        return LightDM.get_can_suspend()

    @prop(str)
    def default_session(self):
        return LightDMGreeter.get_default_session_hint()

    @prop(bool)
    def has_guest_account(self):
        return LightDMGreeter.get_has_guest_account_hint()

    @prop(bool)
    def hide_users(self):
        return LightDMGreeter.get_hide_users_hint()

    @prop(str)
    def hostname(self):
        return LightDM.get_hostname()

    @prop(bool)
    def in_authentication(self):
        return LightDMGreeter.get_in_authentication()

    @prop(bool)
    def is_authenticated(self):
        return LightDMGreeter.get_is_authenticated()

    @prop(QVariant)
    def language(self):
        return language_to_dict(LightDM.get_language())

    @prop(list)
    def languages(self):
        return [language_to_dict(lang) for lang in LightDM.get_languages()]

    @prop(QVariant)
    def layout(self):
        return layout_to_dict(LightDM.get_layout())

    @prop(list)
    def layouts(self):
        return [layout_to_dict(layout) for layout in LightDM.get_layouts()]

    @prop(bool)
    def lock_hint(self):
        return LightDMGreeter.get_lock_hint()

    @prop(list)
    def remote_sessions(self):
        return [session_to_dict(session) for session in LightDM.get_remote_sessions()]

    @prop(bool)
    def select_guest_hint(self):
        return LightDMGreeter.get_select_guest_hint()

    @prop(str)
    def select_user_hint(self):
        return LightDMGreeter.get_select_user_hint() or ''

    @prop(list)
    def sessions(self):
        return [session_to_dict(session) for session in LightDM.get_sessions()]

    @prop(bool)
    def show_manual_login_hint(self):
        return LightDMGreeter.get_show_manual_login_hint()

    @prop(bool)
    def show_remote_login_hint(self):
        return LightDMGreeter.get_show_remote_login_hint()

    @prop(list)
    def users(self):
        return [user_to_dict(user) for user in LightDMUserList.get_users()]

