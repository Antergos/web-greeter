/*
 * lightdm-webkit2-greeter-ext.c
 * 
 * Copyright (C) 2010 Robert Ancell.
 * Author: Robert Ancell <robert.ancell@canonical.com>
 * Webkit2 port: Copyright (C) 2014 Antergos
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version. See http://www.gnu.org/copyleft/gpl.html the full text of the
 * license.
 */

#include <stdlib.h>
#include <gtk/gtk.h>
#include <webkit2/webkit-web-extension.h>
#define WEBKIT_DOM_USE_UNSTABLE_API
#include <webkitdom/WebKitDOMDOMWindowUnstable.h>
#include <JavaScriptCore/JavaScript.h>
#include <glib/gi18n.h>

#include <lightdm.h>

#include <config.h>

G_MODULE_EXPORT void
        webkit_web_extension_initialize(WebKitWebExtension *extension);

guint64 page_id = -1;

static JSClassRef gettext_class;
static JSClassRef lightdm_greeter_class, lightdm_user_class, lightdm_language_class, lightdm_layout_class, lightdm_session_class;

static JSValueRef
get_user_name_cb(JSContextRef context,
                 JSObjectRef thisObject,
                 JSStringRef propertyName,
                 JSValueRef *exception) {
    LightDMUser *user = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_user_get_name(user));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_user_real_name_cb(JSContextRef context,
                      JSObjectRef thisObject,
                      JSStringRef propertyName,
                      JSValueRef *exception) {
    LightDMUser *user = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_user_get_real_name(user));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_user_display_name_cb(JSContextRef context,
                         JSObjectRef thisObject,
                         JSStringRef propertyName,
                         JSValueRef *exception) {
    LightDMUser *user = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_user_get_display_name(user));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_user_image_cb(JSContextRef context,
                  JSObjectRef thisObject,
                  JSStringRef propertyName,
                  JSValueRef *exception) {
    LightDMUser *user = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_user_get_image(user));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_user_language_cb(JSContextRef context,
                     JSObjectRef thisObject,
                     JSStringRef propertyName,
                     JSValueRef *exception) {
    LightDMUser *user = JSObjectGetPrivate(thisObject);
    const gchar *language = lightdm_user_get_language(user);
    JSStringRef string;

    if (!language)
        return JSValueMakeNull(context);

    string = JSStringCreateWithUTF8CString(language);
    return JSValueMakeString(context, string);
}

static JSValueRef
get_user_layout_cb(JSContextRef context,
                   JSObjectRef thisObject,
                   JSStringRef propertyName,
                   JSValueRef *exception) {
    LightDMUser *user = JSObjectGetPrivate(thisObject);
    const gchar *layout = lightdm_user_get_layout(user);
    JSStringRef string;

    if (!layout)
        return JSValueMakeNull(context);

    string = JSStringCreateWithUTF8CString(layout);
    return JSValueMakeString(context, string);
}

static JSValueRef
get_user_session_cb(JSContextRef context,
                    JSObjectRef thisObject,
                    JSStringRef propertyName,
                    JSValueRef *exception) {
    LightDMUser *user = JSObjectGetPrivate(thisObject);
    const gchar *session = lightdm_user_get_session(user);
    JSStringRef string;

    if (!session)
        return JSValueMakeNull(context);

    string = JSStringCreateWithUTF8CString(session);
    return JSValueMakeString(context, string);
}

static JSValueRef
get_user_logged_in_cb(JSContextRef context,
                      JSObjectRef thisObject,
                      JSStringRef propertyName,
                      JSValueRef *exception) {
    LightDMUser *user = JSObjectGetPrivate(thisObject);
    return JSValueMakeBoolean(context, lightdm_user_get_logged_in(user));
}

static JSValueRef
get_language_code_cb(JSContextRef context,
                     JSObjectRef thisObject,
                     JSStringRef propertyName,
                     JSValueRef *exception) {
    LightDMLanguage *language = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_language_get_code(language));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_language_name_cb(JSContextRef context,
                     JSObjectRef thisObject,
                     JSStringRef propertyName,
                     JSValueRef *exception) {
    LightDMLanguage *language = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_language_get_name(language));
    return JSValueMakeString(context, string);
}


static JSValueRef
get_language_territory_cb(JSContextRef context,
                          JSObjectRef thisObject,
                          JSStringRef propertyName,
                          JSValueRef *exception) {
    LightDMLanguage *language = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_language_get_territory(language));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_layout_name_cb(JSContextRef context,
                   JSObjectRef thisObject,
                   JSStringRef propertyName,
                   JSValueRef *exception) {
    LightDMLayout *layout = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_layout_get_name(layout));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_layout_short_description_cb(JSContextRef context,
                                JSObjectRef thisObject,
                                JSStringRef propertyName,
                                JSValueRef *exception) {
    LightDMLayout *layout = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_layout_get_short_description(layout));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_layout_description_cb(JSContextRef context,
                          JSObjectRef thisObject,
                          JSStringRef propertyName,
                          JSValueRef *exception) {
    LightDMLayout *layout = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_layout_get_description(layout));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_session_key_cb(JSContextRef context,
                   JSObjectRef thisObject,
                   JSStringRef propertyName,
                   JSValueRef *exception) {
    LightDMSession *session = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_session_get_key(session));
    return JSValueMakeString(context, string);

}

static JSValueRef
get_session_name_cb(JSContextRef context,
                    JSObjectRef thisObject,
                    JSStringRef propertyName,
                    JSValueRef *exception) {
    LightDMSession *session = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_session_get_name(session));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_session_comment_cb(JSContextRef context,
                       JSObjectRef thisObject,
                       JSStringRef propertyName,
                       JSValueRef *exception) {
    LightDMSession *session = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_session_get_comment(session));
    return JSValueMakeString(context, string);
}

static JSValueRef
get_hostname_cb(JSContextRef context,
                JSObjectRef thisObject,
                JSStringRef propertyName,
                JSValueRef *exception) {
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_get_hostname());

    return JSValueMakeString(context, string);
}

static JSValueRef
get_num_users_cb(JSContextRef context,
                 JSObjectRef thisObject,
                 JSStringRef propertyName,
                 JSValueRef *exception) {
    gint num_users;

    num_users = g_list_length(lightdm_user_list_get_users(lightdm_user_list_get_instance()));
    return JSValueMakeNumber(context, num_users);
}

static JSValueRef
get_users_cb(JSContextRef context,
             JSObjectRef thisObject,
             JSStringRef propertyName,
             JSValueRef *exception) {
    JSObjectRef array;
    const GList *users, *link;
    guint i, n_users = 0;
    JSValueRef *args;

    users = lightdm_user_list_get_users(lightdm_user_list_get_instance());
    n_users = g_list_length((GList *) users);
    args = g_malloc(sizeof(JSValueRef) * (n_users + 1));
    for (i = 0, link = users; link; i++, link = link->next) {
        LightDMUser *user = link->data;
        g_object_ref(user);
        args[i] = JSObjectMake(context, lightdm_user_class, user);
    }

    array = JSObjectMakeArray(context, n_users, args, NULL);
    g_free(args);
    return array;
}

static JSValueRef
get_languages_cb(JSContextRef context,
                 JSObjectRef thisObject,
                 JSStringRef propertyName,
                 JSValueRef *exception) {
    JSObjectRef array;
    const GList *languages, *link;
    guint i, n_languages = 0;
    JSValueRef *args;

    languages = lightdm_get_languages();
    n_languages = g_list_length((GList *) languages);
    args = g_malloc(sizeof(JSValueRef) * (n_languages + 1));
    for (i = 0, link = languages; link; i++, link = link->next) {
        LightDMLanguage *language = link->data;
        g_object_ref(language);
        args[i] = JSObjectMake(context, lightdm_language_class, language);
    }

    array = JSObjectMakeArray(context, n_languages, args, NULL);
    g_free(args);
    return array;
}

static JSValueRef
get_default_language_cb(JSContextRef context,
                        JSObjectRef thisObject,
                        JSStringRef propertyName,
                        JSValueRef *exception) {
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_language_get_name((LightDMLanguage *) lightdm_get_language()));

    return JSValueMakeString(context, string);
}

static JSValueRef
get_default_layout_cb(JSContextRef context,
                      JSObjectRef thisObject,
                      JSStringRef propertyName,
                      JSValueRef *exception) {
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_layout_get_name(lightdm_get_layout()));

    return JSValueMakeString(context, string);
}

static JSValueRef
get_layouts_cb(JSContextRef context,
               JSObjectRef thisObject,
               JSStringRef propertyName,
               JSValueRef *exception) {
    JSObjectRef array;
    const GList *layouts, *link;
    guint i, n_layouts = 0;
    JSValueRef *args;

    layouts = lightdm_get_layouts();
    n_layouts = g_list_length((GList *) layouts);
    args = g_malloc(sizeof(JSValueRef) * (n_layouts + 1));
    for (i = 0, link = layouts; link; i++, link = link->next) {
        LightDMLayout *layout = link->data;
        g_object_ref(layout);
        args[i] = JSObjectMake(context, lightdm_layout_class, layout);
    }

    array = JSObjectMakeArray(context, n_layouts, args, NULL);
    g_free(args);
    return array;
}

static JSValueRef
get_layout_cb(JSContextRef context,
              JSObjectRef thisObject,
              JSStringRef propertyName,
              JSValueRef *exception) {
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_layout_get_name(lightdm_get_layout()));

    return JSValueMakeString(context, string);
}

static bool
set_layout_cb(JSContextRef context,
              JSObjectRef thisObject,
              JSStringRef propertyName,
              JSValueRef value,
              JSValueRef *exception) {
    JSStringRef layout_arg;
    char layout[1024];

    // FIXME: Throw exception
    if (JSValueGetType(context, value) != kJSTypeString)
        return false;

    layout_arg = JSValueToStringCopy(context, value, NULL);
    JSStringGetUTF8CString(layout_arg, layout, 1024);
    JSStringRelease(layout_arg);

    //lightdm_set_layout (layout);

    return true;
}

static JSValueRef
get_sessions_cb(JSContextRef context,
                JSObjectRef thisObject,
                JSStringRef propertyName,
                JSValueRef *exception) {
    JSObjectRef array;
    const GList *sessions, *link;
    guint i, n_sessions = 0;
    JSValueRef *args;

    sessions = lightdm_get_sessions();
    n_sessions = g_list_length((GList *) sessions);
    args = g_malloc(sizeof(JSValueRef) * (n_sessions + 1));
    for (i = 0, link = sessions; link; i++, link = link->next) {
        LightDMSession *session = link->data;
        g_object_ref(session);
        args[i] = JSObjectMake(context, lightdm_session_class, session);
    }

    array = JSObjectMakeArray(context, n_sessions, args, NULL);
    g_free(args);
    return array;
}

static JSValueRef
get_default_session_cb(JSContextRef context,
                       JSObjectRef thisObject,
                       JSStringRef propertyName,
                       JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_greeter_get_default_session_hint(greeter));

    return JSValueMakeString(context, string);
}

static JSValueRef
get_timed_login_user_cb(JSContextRef context,
                        JSObjectRef thisObject,
                        JSStringRef propertyName,
                        JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    JSStringRef string;

    string = JSStringCreateWithUTF8CString(lightdm_greeter_get_autologin_user_hint(greeter));

    return JSValueMakeString(context, string);
}

static JSValueRef
get_timed_login_delay_cb(JSContextRef context,
                         JSObjectRef thisObject,
                         JSStringRef propertyName,
                         JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    gint delay;

    delay = lightdm_greeter_get_autologin_timeout_hint(greeter);
    return JSValueMakeNumber(context, delay);
}

static JSValueRef
cancel_timed_login_cb(JSContextRef context,
                      JSObjectRef function,
                      JSObjectRef thisObject,
                      size_t argumentCount,
                      const JSValueRef arguments[],
                      JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);

    // FIXME: Throw exception
    if (argumentCount != 0)
        return JSValueMakeNull(context);

    lightdm_greeter_cancel_autologin(greeter);
    return JSValueMakeNull(context);
}

static JSValueRef
start_authentication_cb(JSContextRef context,
                        JSObjectRef function,
                        JSObjectRef thisObject,
                        size_t argumentCount,
                        const JSValueRef arguments[],
                        JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    JSStringRef name_arg;
    char name[1024];

    // FIXME: Throw exception
    if (!(argumentCount == 1 && JSValueGetType(context, arguments[0]) == kJSTypeString))
        return JSValueMakeNull(context);

    name_arg = JSValueToStringCopy(context, arguments[0], NULL);
    JSStringGetUTF8CString(name_arg, name, 1024);
    JSStringRelease(name_arg);

    lightdm_greeter_authenticate(greeter, name);
    return JSValueMakeNull(context);
}

static JSValueRef
provide_secret_cb(JSContextRef context,
                  JSObjectRef function,
                  JSObjectRef thisObject,
                  size_t argumentCount,
                  const JSValueRef arguments[],
                  JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    JSStringRef secret_arg;
    char secret[1024];

    // FIXME: Throw exception
    if (!(argumentCount == 1 && JSValueGetType(context, arguments[0]) == kJSTypeString))
        return JSValueMakeNull(context);

    secret_arg = JSValueToStringCopy(context, arguments[0], NULL);
    JSStringGetUTF8CString(secret_arg, secret, 1024);
    JSStringRelease(secret_arg);

    lightdm_greeter_respond(greeter, secret);

    return JSValueMakeNull(context);
}

static JSValueRef
cancel_authentication_cb(JSContextRef context,
                         JSObjectRef function,
                         JSObjectRef thisObject,
                         size_t argumentCount,
                         const JSValueRef arguments[],
                         JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);

    // FIXME: Throw exception
    if (argumentCount != 0)
        return JSValueMakeNull(context);

    lightdm_greeter_cancel_authentication(greeter);
    return JSValueMakeNull(context);
}

static JSValueRef
get_authentication_user_cb(JSContextRef context,
                           JSObjectRef thisObject,
                           JSStringRef propertyName,
                           JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_greeter_get_authentication_user(greeter)));
}

static JSValueRef
get_is_authenticated_cb(JSContextRef context,
                        JSObjectRef thisObject,
                        JSStringRef propertyName,
                        JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    return JSValueMakeBoolean(context, lightdm_greeter_get_is_authenticated(greeter));
}

static JSValueRef
get_can_suspend_cb(JSContextRef context,
                   JSObjectRef thisObject,
                   JSStringRef propertyName,
                   JSValueRef *exception) {
    return JSValueMakeBoolean(context, lightdm_get_can_suspend());
}

static JSValueRef
suspend_cb(JSContextRef context,
           JSObjectRef function,
           JSObjectRef thisObject,
           size_t argumentCount,
           const JSValueRef arguments[],
           JSValueRef *exception) {
    // FIXME: Throw exception
    if (argumentCount != 0)
        return JSValueMakeNull(context);

    lightdm_suspend(NULL);
    return JSValueMakeNull(context);
}

static JSValueRef
get_can_hibernate_cb(JSContextRef context,
                     JSObjectRef thisObject,
                     JSStringRef propertyName,
                     JSValueRef *exception) {
    return JSValueMakeBoolean(context, lightdm_get_can_hibernate());
}

static JSValueRef
hibernate_cb(JSContextRef context,
             JSObjectRef function,
             JSObjectRef thisObject,
             size_t argumentCount,
             const JSValueRef arguments[],
             JSValueRef *exception) {
    // FIXME: Throw exception
    if (argumentCount != 0)
        return JSValueMakeNull(context);

    lightdm_hibernate(NULL);
    return JSValueMakeNull(context);
}

static JSValueRef
get_can_restart_cb(JSContextRef context,
                   JSObjectRef thisObject,
                   JSStringRef propertyName,
                   JSValueRef *exception) {
    return JSValueMakeBoolean(context, lightdm_get_can_restart());
}

static JSValueRef
restart_cb(JSContextRef context,
           JSObjectRef function,
           JSObjectRef thisObject,
           size_t argumentCount,
           const JSValueRef arguments[],
           JSValueRef *exception) {
    // FIXME: Throw exception
    if (argumentCount != 0)
        return JSValueMakeNull(context);

    lightdm_restart(NULL);
    return JSValueMakeNull(context);
}

static JSValueRef
get_can_shutdown_cb(JSContextRef context,
                    JSObjectRef thisObject,
                    JSStringRef propertyName,
                    JSValueRef *exception) {
    return JSValueMakeBoolean(context, lightdm_get_can_shutdown());
}

static JSValueRef
shutdown_cb(JSContextRef context,
            JSObjectRef function,
            JSObjectRef thisObject,
            size_t argumentCount,
            const JSValueRef arguments[],
            JSValueRef *exception) {
    // FIXME: Throw exception
    if (argumentCount != 0)
        return JSValueMakeNull(context);

    lightdm_shutdown(NULL);
    return JSValueMakeNull(context);
}

static JSValueRef
login_cb(JSContextRef context,
         JSObjectRef function,
         JSObjectRef thisObject,
         size_t argumentCount,
         const JSValueRef arguments[],
         JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    JSStringRef arg;
    char username[1024], *session = NULL;

    // FIXME: Throw exception

    arg = JSValueToStringCopy(context, arguments[0], NULL);
    JSStringGetUTF8CString(arg, username, 1024);
    JSStringRelease(arg);

    if (argumentCount > 1) {
        arg = JSValueToStringCopy(context, arguments[1], NULL);
        session = g_malloc(sizeof(char) * 1024);
        JSStringGetUTF8CString(arg, session, 1024);
        JSStringRelease(arg);
    }

    lightdm_greeter_start_session_sync(greeter, session, NULL);

    g_free(session);

    return JSValueMakeNull(context);
}

static JSValueRef
set_language_cb(JSContextRef context,
                JSObjectRef function,
                JSObjectRef thisObject,
                size_t argumentCount,
                const JSValueRef arguments[],
                JSValueRef *exception) {
    LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
    JSStringRef arg;
    char language[1024];

    // FIXME: Throw exception

    arg = JSValueToStringCopy(context, arguments[0], NULL);
    JSStringGetUTF8CString(arg, language, 1024);
    JSStringRelease(arg);

    lightdm_greeter_set_language(greeter, language);

    return JSValueMakeNull(context);
}

static JSValueRef
gettext_cb(JSContextRef context,
           JSObjectRef function,
           JSObjectRef thisObject,
           size_t argumentCount,
           const JSValueRef arguments[],
           JSValueRef *exception) {
    JSStringRef string_arg, result;
    char string[1024];

    // FIXME: Throw exception
    if (argumentCount != 1)
        return JSValueMakeNull(context);

    string_arg = JSValueToStringCopy(context, arguments[0], NULL);
    JSStringGetUTF8CString(string_arg, string, 1024);
    JSStringRelease(string_arg);

    result = JSStringCreateWithUTF8CString(gettext(string));
    return JSValueMakeString(context, result);
}

static JSValueRef
ngettext_cb(JSContextRef context,
            JSObjectRef function,
            JSObjectRef thisObject,
            size_t argumentCount,
            const JSValueRef arguments[],
            JSValueRef *exception) {
    JSStringRef string_arg, plural_string_arg, result;
    char string[1024], plural_string[1024];
    unsigned int n;

    // FIXME: Throw exception
    if (argumentCount != 3)
        return JSValueMakeNull(context);

    string_arg = JSValueToStringCopy(context, arguments[0], NULL);
    JSStringGetUTF8CString(string_arg, string, 1024);
    JSStringRelease(string_arg);

    plural_string_arg = JSValueToStringCopy(context, arguments[1], NULL);
    JSStringGetUTF8CString(plural_string_arg, string, 1024);
    JSStringRelease(plural_string_arg);

    n = JSValueToNumber(context, arguments[2], NULL);

    result = JSStringCreateWithUTF8CString(ngettext(string, plural_string, n));
    return JSValueMakeString(context, result);
}

static const JSStaticValue lightdm_user_values[] =
        {
                {"name",         get_user_name_cb,         NULL, kJSPropertyAttributeReadOnly},
                {"real_name",    get_user_real_name_cb,    NULL, kJSPropertyAttributeReadOnly},
                {"display_name", get_user_display_name_cb, NULL, kJSPropertyAttributeReadOnly},
                {"image",        get_user_image_cb,        NULL, kJSPropertyAttributeReadOnly},
                {"language",     get_user_language_cb,     NULL, kJSPropertyAttributeReadOnly},
                {"layout",       get_user_layout_cb,       NULL, kJSPropertyAttributeReadOnly},
                {"session",      get_user_session_cb,      NULL, kJSPropertyAttributeReadOnly},
                {"logged_in",    get_user_logged_in_cb,    NULL, kJSPropertyAttributeReadOnly},
                {NULL,           NULL,                     NULL, 0}
        };

static const JSStaticValue lightdm_language_values[] =
        {
                {"code",      get_language_code_cb,      NULL, kJSPropertyAttributeReadOnly},
                {"name",      get_language_name_cb,      NULL, kJSPropertyAttributeReadOnly},
                {"territory", get_language_territory_cb, NULL, kJSPropertyAttributeReadOnly},
                {NULL,        NULL,                      NULL, 0}
        };

static const JSStaticValue lightdm_layout_values[] =
        {
                {"name",              get_layout_name_cb,              NULL, kJSPropertyAttributeReadOnly},
                {"short_description", get_layout_short_description_cb, NULL, kJSPropertyAttributeReadOnly},
                {"description",       get_layout_description_cb,       NULL, kJSPropertyAttributeReadOnly},
                {NULL,                NULL,                            NULL, 0}
        };

static const JSStaticValue lightdm_session_values[] =
        {
                {"key",     get_session_key_cb,     NULL, kJSPropertyAttributeReadOnly},
                {"name",    get_session_name_cb,    NULL, kJSPropertyAttributeReadOnly},
                {"comment", get_session_comment_cb, NULL, kJSPropertyAttributeReadOnly},
                {NULL,      NULL,                   NULL, 0}
        };

static const JSStaticValue lightdm_greeter_values[] =
        {
                {"hostname",            get_hostname_cb,            NULL,          kJSPropertyAttributeReadOnly},
                {"users",               get_users_cb,               NULL,          kJSPropertyAttributeReadOnly},
                {"default_language",    get_default_language_cb,    NULL,          kJSPropertyAttributeReadOnly},
                {"languages",           get_languages_cb,           NULL,          kJSPropertyAttributeReadOnly},
                {"default_layout",      get_default_layout_cb,      NULL,          kJSPropertyAttributeReadOnly},
                {"layouts",             get_layouts_cb,             NULL,          kJSPropertyAttributeReadOnly},
                {"layout",              get_layout_cb,              set_layout_cb, kJSPropertyAttributeReadOnly},
                {"sessions",            get_sessions_cb,            NULL,          kJSPropertyAttributeReadOnly},
                {"num_users",           get_num_users_cb,           NULL,          kJSPropertyAttributeReadOnly},
                {"default_session",     get_default_session_cb,     NULL,          kJSPropertyAttributeNone},
                {"timed_login_user",    get_timed_login_user_cb,    NULL,          kJSPropertyAttributeReadOnly},
                {"timed_login_delay",   get_timed_login_delay_cb,   NULL,          kJSPropertyAttributeReadOnly},
                {"authentication_user", get_authentication_user_cb, NULL,          kJSPropertyAttributeReadOnly},
                {"is_authenticated",    get_is_authenticated_cb,    NULL,          kJSPropertyAttributeReadOnly},
                {"can_suspend",         get_can_suspend_cb,         NULL,          kJSPropertyAttributeReadOnly},
                {"can_hibernate",       get_can_hibernate_cb,       NULL,          kJSPropertyAttributeReadOnly},
                {"can_restart",         get_can_restart_cb,         NULL,          kJSPropertyAttributeReadOnly},
                {"can_shutdown",        get_can_shutdown_cb,        NULL,          kJSPropertyAttributeReadOnly},
                {NULL,                  NULL,                       NULL,          0}
        };

static const JSStaticFunction lightdm_greeter_functions[] =
        {
                {"cancel_timed_login",    cancel_timed_login_cb,    kJSPropertyAttributeReadOnly},
                {"start_authentication",  start_authentication_cb,  kJSPropertyAttributeReadOnly},
                {"provide_secret",        provide_secret_cb,        kJSPropertyAttributeReadOnly},
                {"cancel_authentication", cancel_authentication_cb, kJSPropertyAttributeReadOnly},
                {"suspend",               suspend_cb,               kJSPropertyAttributeReadOnly},
                {"hibernate",             hibernate_cb,             kJSPropertyAttributeReadOnly},
                {"restart",               restart_cb,               kJSPropertyAttributeReadOnly},
                {"shutdown",              shutdown_cb,              kJSPropertyAttributeReadOnly},
                {"set_language",          set_language_cb,          kJSPropertyAttributeReadOnly},
                {"login",                 login_cb,                 kJSPropertyAttributeReadOnly},
                {NULL,                    NULL,                     0}
        };

static const JSStaticFunction gettext_functions[] =
        {
                {"gettext",  gettext_cb,  kJSPropertyAttributeReadOnly},
                {"ngettext", ngettext_cb, kJSPropertyAttributeReadOnly},
                {NULL,       NULL,        0}
        };

static const JSClassDefinition lightdm_user_definition =
        {
                0,                     /* Version */
                kJSClassAttributeNone, /* Attributes */
                "LightDMUser",             /* Class name */
                NULL,                  /* Parent class */
                lightdm_user_values,       /* Static values */
        };

static const JSClassDefinition lightdm_language_definition =
        {
                0,                     /* Version */
                kJSClassAttributeNone, /* Attributes */
                "LightDMLanguage",         /* Class name */
                NULL,                  /* Parent class */
                lightdm_language_values,   /* Static values */
        };

static const JSClassDefinition lightdm_layout_definition =
        {
                0,                     /* Version */
                kJSClassAttributeNone, /* Attributes */
                "LightDMLayout",           /* Class name */
                NULL,                  /* Parent class */
                lightdm_layout_values,     /* Static values */
        };

static const JSClassDefinition lightdm_session_definition =
        {
                0,                     /* Version */
                kJSClassAttributeNone, /* Attributes */
                "LightDMSession",          /* Class name */
                NULL,                  /* Parent class */
                lightdm_session_values,    /* Static values */
        };

static const JSClassDefinition lightdm_greeter_definition =
        {
                0,                     /* Version */
                kJSClassAttributeNone, /* Attributes */
                "LightDMGreeter",          /* Class name */
                NULL,                  /* Parent class */
                lightdm_greeter_values,    /* Static values */
                lightdm_greeter_functions, /* Static functions */
        };

static const JSClassDefinition gettext_definition =
        {
                0,                     /* Version */
                kJSClassAttributeNone, /* Attributes */
                "GettextClass",        /* Class name */
                NULL,                  /* Parent class */
                NULL,
                gettext_functions,     /* Static functions */
        };

static void
web_page_created_callback(WebKitWebExtension *extension,
                          WebKitWebPage *web_page,
                          gpointer user_data) {
    /* guint64 page_id = webkit_web_page_get_id (web_page); */

    g_print("Page %" G_GUINT64_FORMAT "created for %s\n",
            webkit_web_page_get_id(web_page),
            webkit_web_page_get_uri(web_page));
}

static void
window_object_cleared_callback(WebKitScriptWorld *world,
                               WebKitWebPage *web_page,
                               WebKitFrame *frame,
                               LightDMGreeter *greeter) {
    JSObjectRef gettext_object, lightdm_greeter_object;
    JSGlobalContextRef jsContext;
    JSObjectRef globalObject;

    page_id = webkit_web_page_get_id(web_page);

    jsContext = webkit_frame_get_javascript_context_for_script_world(frame, world);
    globalObject = JSContextGetGlobalObject(jsContext);

    gettext_class = JSClassCreate(&gettext_definition);
    lightdm_greeter_class = JSClassCreate(&lightdm_greeter_definition);
    lightdm_user_class = JSClassCreate(&lightdm_user_definition);
    lightdm_language_class = JSClassCreate(&lightdm_language_definition);
    lightdm_layout_class = JSClassCreate(&lightdm_layout_definition);
    lightdm_session_class = JSClassCreate(&lightdm_session_definition);

    gettext_object = JSObjectMake(jsContext, gettext_class, NULL);

    JSObjectSetProperty(jsContext,
                        globalObject,
                        JSStringCreateWithUTF8CString("gettext"),
                        gettext_object, kJSPropertyAttributeNone, NULL);

    lightdm_greeter_object = JSObjectMake(jsContext, lightdm_greeter_class, greeter);

    JSObjectSetProperty(jsContext,
                        globalObject,
                        JSStringCreateWithUTF8CString("lightdm"),
                        lightdm_greeter_object, kJSPropertyAttributeNone, NULL);
}

static void
show_prompt_cb(LightDMGreeter *greeter, const gchar *text, LightDMPromptType type, WebKitWebExtension *extension) {
    WebKitWebPage *web_page;
    WebKitFrame *web_frame;
    JSGlobalContextRef jsContext;
    JSStringRef command;
    gchar *string;

    g_debug("Show prompt %s", text);

    web_page = webkit_web_extension_get_page(extension, page_id);

    if (web_page != NULL) {
        web_frame = webkit_web_page_get_main_frame(web_page);

        jsContext = webkit_frame_get_javascript_global_context(web_frame);

        string = g_strdup_printf("show_prompt('%s')", text);
        command = JSStringCreateWithUTF8CString(string);

        JSEvaluateScript(jsContext, command, NULL, NULL, 0, NULL);

        g_free(string);
    }
}

static void
show_message_cb(LightDMGreeter *greeter, const gchar *text, LightDMMessageType type, WebKitWebExtension *extension) {
    WebKitWebPage *web_page;
    WebKitFrame *web_frame;
    JSGlobalContextRef jsContext;
    JSStringRef command;
    gchar *string;

    web_page = webkit_web_extension_get_page(extension, page_id);
    if (web_page != NULL) {
        web_frame = webkit_web_page_get_main_frame(web_page);

        jsContext = webkit_frame_get_javascript_global_context(web_frame);

        string = g_strdup_printf("show_message('%s')", text);
        command = JSStringCreateWithUTF8CString(string);

        JSEvaluateScript(jsContext, command, NULL, NULL, 0, NULL);

        g_free(string);
    }
}

static void
authentication_complete_cb(LightDMGreeter *greeter, WebKitWebExtension *extension) {
    WebKitWebPage *web_page;
    WebKitFrame *web_frame;
    JSGlobalContextRef jsContext;
    JSStringRef command;

    web_page = webkit_web_extension_get_page(extension, page_id);

    if (web_page != NULL) {
        web_frame = webkit_web_page_get_main_frame(web_page);

        jsContext = webkit_frame_get_javascript_global_context(web_frame);

        command = JSStringCreateWithUTF8CString("authentication_complete()");

        JSEvaluateScript(jsContext, command, NULL, NULL, 0, NULL);
    }
}

static gboolean
fade_timer_cb(gpointer data) {
    gdouble opacity;

    opacity = gtk_widget_get_opacity(window);
    opacity -= 0.1;
    if (opacity <= 0) {
        gtk_main_quit();
        return FALSE;
    }
    gtk_widget_set_opacity(window, opacity);

    return TRUE;
}

static void
quit_cb(LightDMGreeter *greeter, const gchar *username) {

    // Fade out the greeter
    g_timeout_add(40, (GSourceFunc) fade_timer_cb, NULL);
}

G_MODULE_EXPORT void
webkit_web_extension_initialize(WebKitWebExtension *extension) {
    LightDMGreeter *greeter;

    greeter = lightdm_greeter_new();

    g_signal_connect(G_OBJECT(greeter), "authentication-complete", G_CALLBACK(authentication_complete_cb), extension);
    g_signal_connect(G_OBJECT(greeter), "show-prompt", G_CALLBACK(show_prompt_cb), extension);
    g_signal_connect(G_OBJECT(greeter), "show-message", G_CALLBACK(show_message_cb), extension);
    g_signal_connect(G_OBJECT(greeter), "show-error", G_CALLBACK(show_message_cb), extension);
    g_signal_connect(G_OBJECT(greeter), "quit", G_CALLBACK(quit_cb), extension);

    g_signal_connect(extension, "page-created", G_CALLBACK(web_page_created_callback), NULL);

    g_signal_connect(webkit_script_world_get_default(),
                     "window-object-cleared",
                     G_CALLBACK(window_object_cleared_callback),
                     greeter);

    lightdm_greeter_connect_sync(greeter, NULL);
}

