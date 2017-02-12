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
import time

# 3rd-Party Libs
import gi
gi.require_version('LightDM', '1')
from gi.repository import LightDM
from whither.bridge import (
    BridgeObject,
    bridge,
    Variant,
)
from PyQt5.QtCore import QTimer

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

    # LightDM.Greeter Signals
    authentication_complete = bridge.signal()
    autologin_timer_expired = bridge.signal()
    idle = bridge.signal()
    reset = bridge.signal()
    show_message = bridge.signal(str, LightDM.MessageType, arguments=('text', 'type'))
    show_prompt = bridge.signal(str, LightDM.PromptType, arguments=('text', 'type'))

    # Property values are cached on the JavaScript side and will only update when
    # a notify signal is emitted. We use the same signal for all properties which means
    # all properties get updated when any property is changed. That's not a problem with
    # the small number of properties we have.
    property_changed = bridge.signal()

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
        LightDMGreeter.connect(
            'authentication-complete',
            lambda greeter: self._emit_signal(self.authentication_complete)
        )
        LightDMGreeter.connect(
            'autologin-timer-expired',
            lambda greeter: self._emit_signal(self.autologin_timer_expired)
        )

        LightDMGreeter.connect('idle', lambda greeter: self._emit_signal(self.idle))
        LightDMGreeter.connect('reset', lambda greeter: self._emit_signal(self.reset))

        LightDMGreeter.connect(
            'show-message',
            lambda greeter, msg, mtype: self._emit_signal(self.show_message, msg, mtype)
        )
        LightDMGreeter.connect(
            'show-prompt',
            lambda greeter, msg, mtype: self._emit_signal(self.show_prompt, msg, mtype)
        )

    def _emit_signal(self, _signal, *args):
        self.property_changed.emit()
        QTimer().singleShot(300, lambda: _signal.emit(*args))

    @staticmethod
    @bridge.prop(str, notify=property_changed)
    def authentication_user():
        return LightDMGreeter.get_authentication_user() or ''

    @staticmethod
    @bridge.prop(bool)
    def autologin_guest():
        return LightDMGreeter.get_autologin_guest_hint()

    @staticmethod
    @bridge.prop(int)
    def autologin_timeout():
        return LightDMGreeter.get_autologin_timeout_hint()

    @staticmethod
    @bridge.prop(str)
    def autologin_user():
        return LightDMGreeter.get_autologin_user_hint()

    @staticmethod
    @bridge.prop(bool)
    def can_hibernate():
        return LightDM.get_can_hibernate()

    @staticmethod
    @bridge.prop(bool)
    def can_restart():
        return LightDM.get_can_restart()

    @staticmethod
    @bridge.prop(bool)
    def can_shutdown():
        return LightDM.get_can_shutdown()

    @staticmethod
    @bridge.prop(bool)
    def can_suspend():
        return LightDM.get_can_suspend()

    @staticmethod
    @bridge.prop(str)
    def default_session():
        return LightDMGreeter.get_default_session_hint()

    @staticmethod
    @bridge.prop(bool)
    def has_guest_account():
        return LightDMGreeter.get_has_guest_account_hint()

    @staticmethod
    @bridge.prop(bool)
    def hide_users():
        return LightDMGreeter.get_hide_users_hint()

    @staticmethod
    @bridge.prop(str)
    def hostname():
        return LightDM.get_hostname()

    @staticmethod
    @bridge.prop(bool, notify=property_changed)
    def in_authentication():
        return LightDMGreeter.get_in_authentication()

    @staticmethod
    @bridge.prop(bool, notify=property_changed)
    def is_authenticated():
        return LightDMGreeter.get_is_authenticated()

    @staticmethod
    @bridge.prop(Variant, notify=property_changed)
    def language():
        return language_to_dict(LightDM.get_language())

    @staticmethod
    @bridge.prop(Variant)
    def languages():
        return [language_to_dict(lang) for lang in LightDM.get_languages()]

    @staticmethod
    @bridge.prop(Variant)
    def layout():
        return layout_to_dict(LightDM.get_layout())

    @staticmethod
    @bridge.prop(Variant)
    def layouts():
        return [layout_to_dict(layout) for layout in LightDM.get_layouts()]

    @staticmethod
    @bridge.prop(bool)
    def lock_hint():
        return LightDMGreeter.get_lock_hint()

    @staticmethod
    @bridge.prop(Variant, notify=property_changed)
    def remote_sessions():
        return [session_to_dict(session) for session in LightDM.get_remote_sessions()]

    @staticmethod
    @bridge.prop(bool)
    def select_guest_hint():
        return LightDMGreeter.get_select_guest_hint()

    @staticmethod
    @bridge.prop(str)
    def select_user_hint():
        return LightDMGreeter.get_select_user_hint() or ''

    @staticmethod
    @bridge.prop(Variant)
    def sessions():
        return [session_to_dict(session) for session in LightDM.get_sessions()]

    @bridge.prop(str)
    def shared_data_directory(self):
        return self._shared_data_directory

    @staticmethod
    @bridge.prop(bool)
    def show_manual_login_hint():
        return LightDMGreeter.get_show_manual_login_hint()

    @staticmethod
    @bridge.prop(bool)
    def show_remote_login_hint():
        return LightDMGreeter.get_show_remote_login_hint()

    @bridge.prop(str)
    def themes_directory(self):
        return self._themes_directory

    @staticmethod
    @bridge.prop(Variant)
    def users():
        return [user_to_dict(user) for user in LightDMUsers.get_users()]

    @bridge.method(str)
    def authenticate(self, username):
        LightDMGreeter.authenticate(username)
        self.property_changed.emit()

    @bridge.method()
    def authenticate_as_guest(self):
        LightDMGreeter.authenticate_as_guest()
        self.property_changed.emit()

    @bridge.method()
    def cancel_authentication(self):
        LightDMGreeter.cancel_authentication()
        self.property_changed.emit()

    @bridge.method()
    def cancel_autologin(self):
        LightDMGreeter.cancel_autologin()
        self.property_changed.emit()

    @staticmethod
    @bridge.method(result=bool)
    def hibernate():
        return LightDMGreeter.hibernate()

    @bridge.method(str)
    def respond(self, response):
        LightDMGreeter.respond(response)
        self.property_changed.emit()

    @staticmethod
    @bridge.method(result=bool)
    def restart():
        return LightDMGreeter.restart()

    @bridge.method(str)
    def set_language(self, lang):
        if self.is_authenticated:
            LightDMGreeter.set_language(lang)
            self.property_changed.emit()

    @staticmethod
    @bridge.method(result=bool)
    def shutdown():
        return LightDMGreeter.shutdown()

    @staticmethod
    @bridge.method(str, result=bool)
    def start_session(session):
        return LightDMGreeter.start_session_sync(session)

    @staticmethod
    @bridge.method(result=bool)
    def suspend():
        return LightDMGreeter.suspend()





