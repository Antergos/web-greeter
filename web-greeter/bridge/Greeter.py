#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  Greeter.py
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
from whither.bridge import (
    BridgeObject,
    bridge,
    Variant,
)

# This Application
from . import (
    language_to_dict,
    layout_to_dict,
    session_to_dict,
    user_to_dict,
)


LightDMGreeter = LightDM.Greeter()
LightDMUsers = LightDM.UserList()


class Greeter(BridgeObject):

    authentication_complete = bridge.signal(LightDM.Greeter, name='authentication_complete')
    autologin_timer_expired = bridge.signal(LightDM.Greeter, name='autologin_timer_expired')

    idle = bridge.signal(LightDM.Greeter, name='idle')
    reset = bridge.signal(LightDM.Greeter, name='reset')

    show_message = bridge.signal(
        (LightDM.Greeter, str, LightDM.MessageType),
        name='show_message',
        arguments=('text', 'type')
    )
    show_prompt = bridge.signal(
        (LightDM.Greeter, str, LightDM.PromptType),
        name='show_prompt',
        arguments=('text', 'type')
    )

    def __init__(self, themes_dir, *args, **kwargs):
        super().__init__(name='LightDMGreeter', *args, **kwargs)

        self._shared_data_directory = ''
        self._themes_directory = themes_dir

        LightDMGreeter.connect_to_daemon_sync()

        self._connect_signals()
        self._determine_shared_data_directory_path()

    def _determine_shared_data_directory_path(self):
        user = LightDMUsers.get_users()[0]
        user_data_dir = LightDMGreeter.ensure_shared_data_dir_sync(user.get_name())
        self._shared_data_directory = user_data_dir.rpartition('/')[0]

    def _connect_signals(self):
        LightDMGreeter.connect('authentication-complete', self.authentication_complete.emit)
        LightDMGreeter.connect('autologin-timer-expired', self.authentication_complete.emit)
        LightDMGreeter.connect('idle', self.idle.emit)
        LightDMGreeter.connect('reset', self.reset.emit)
        LightDMGreeter.connect('show-message', self.show_message.emit)
        LightDMGreeter.connect('show-prompt', self.show_prompt.emit)

    @bridge.prop(str)
    def authentication_user(self):
        return LightDMGreeter.get_authentication_user() or ''

    @bridge.prop(bool)
    def autologin_guest(self):
        return LightDMGreeter.get_autologin_guest_hint()

    @bridge.prop(int)
    def autologin_timeout(self):
        return LightDMGreeter.get_autologin_timeout_hint()

    @bridge.prop(str)
    def autologin_user(self):
        return LightDMGreeter.get_autologin_user_hint()

    @bridge.prop(bool)
    def can_hibernate(self):
        return LightDM.get_can_hibernate()

    @bridge.prop(bool)
    def can_restart(self):
        return LightDM.get_can_restart()

    @bridge.prop(bool)
    def can_shutdown(self):
        return LightDM.get_can_shutdown()

    @bridge.prop(bool)
    def can_suspend(self):
        return LightDM.get_can_suspend()

    @bridge.prop(str)
    def default_session(self):
        return LightDMGreeter.get_default_session_hint()

    @bridge.prop(bool)
    def has_guest_account(self):
        return LightDMGreeter.get_has_guest_account_hint()

    @bridge.prop(bool)
    def hide_users(self):
        return LightDMGreeter.get_hide_users_hint()

    @bridge.prop(str)
    def hostname(self):
        return LightDM.get_hostname()

    @bridge.prop(bool)
    def in_authentication(self):
        return LightDMGreeter.get_in_authentication()

    @bridge.prop(bool)
    def is_authenticated(self):
        return LightDMGreeter.get_is_authenticated()

    @bridge.prop(Variant)
    def language(self):
        return language_to_dict(LightDM.get_language())

    @bridge.prop(Variant)
    def languages(self):
        return [language_to_dict(lang) for lang in LightDM.get_languages()]

    @bridge.prop(Variant)
    def layout(self):
        return layout_to_dict(LightDM.get_layout())

    @bridge.prop(Variant)
    def layouts(self):
        return [layout_to_dict(layout) for layout in LightDM.get_layouts()]

    @bridge.prop(bool)
    def lock_hint(self):
        return LightDMGreeter.get_lock_hint()

    @bridge.prop(Variant)
    def remote_sessions(self):
        return [session_to_dict(session) for session in LightDM.get_remote_sessions()]

    @bridge.prop(bool)
    def select_guest_hint(self):
        return LightDMGreeter.get_select_guest_hint()

    @bridge.prop(str)
    def select_user_hint(self):
        return LightDMGreeter.get_select_user_hint() or ''

    @bridge.prop(Variant)
    def sessions(self):
        return [session_to_dict(session) for session in LightDM.get_sessions()]

    @bridge.prop(str)
    def shared_data_directory(self):
        return self._shared_data_directory

    @bridge.prop(bool)
    def show_manual_login_hint(self):
        return LightDMGreeter.get_show_manual_login_hint()

    @bridge.prop(bool)
    def show_remote_login_hint(self):
        return LightDMGreeter.get_show_remote_login_hint()

    @bridge.prop(str)
    def themes_directory(self):
        return self._themes_directory

    @bridge.prop(Variant)
    def users(self):
        return [user_to_dict(user) for user in LightDMUsers.get_users()]

    @bridge.method(str)
    def authenticate(self, username):
        LightDMGreeter.authenticate(username)

    @bridge.method()
    def authenticate_as_guest(self):
        LightDMGreeter.authenticate_as_guest()

    @bridge.method()
    def cancel_authentication(self):
        LightDMGreeter.cancel_authentication()

    @bridge.method()
    def cancel_autologin(self):
        LightDMGreeter.cancel_autologin()

    @bridge.method(result=bool)
    def hibernate(self):
        return LightDMGreeter.hibernate()

    @bridge.method(str)
    def respond(self, response):
        LightDMGreeter.respond(response)

    @bridge.method(result=bool)
    def restart(self):
        return LightDMGreeter.restart()

    @bridge.method(str)
    def set_language(self, lang):
        if self.is_authenticated:
            LightDMGreeter.set_language(lang)

    @bridge.method(result=bool)
    def shutdown(self):
        return LightDMGreeter.shutdown()

    @bridge.method(str, result=bool)
    def start_session(self, session):
        return LightDMGreeter.start_session_sync(session)

    @bridge.method(result=bool)
    def suspend(self):
        return LightDMGreeter.suspend()





