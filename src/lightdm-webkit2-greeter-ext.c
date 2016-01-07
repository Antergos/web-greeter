/*
 * lightdm-webkit2-greeter-ext.c
 *
 * Copyright © 2014-2015 Antergos Developers <dev@antergos.com>
 *
 * Based on code from lightdm-webkit-greeter:
 * Copyright © 2010-2015 Robert Ancell <robert.ancell@canonical.com>
 *
 * This file is part of lightdm-webkit2-greeter.
 *
 * lightdm-webkit2-greeter is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * lightdm-webkit2-greeter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of the license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with lightdm-webkit2-greeter; If not, see <http://www.gnu.org/licenses/>.
 *
 */

#include <stdlib.h>
#include <config.h>
#include <gtk/gtk.h>
#include <glib/gi18n.h>

#include <webkit2/webkit-web-extension.h>
#include <webkitdom/WebKitDOMCustom.h>
#include <JavaScriptCore/JavaScript.h>

#include <lightdm.h>

G_MODULE_EXPORT void webkit_web_extension_initialize(WebKitWebExtension *extension);

guint64 page_id = -1;

static JSClassRef
	lightdm_greeter_class,
	gettext_class,
	lightdm_user_class,
	lightdm_language_class,
	lightdm_layout_class,
	lightdm_session_class;

static char *
escape (const gchar *text)
{
	size_t len;
	size_t i, j;
	int count = 0;
	gchar *escaped;

	len = strlen (text);

	for (i = 0; i < len; i++)
		if (text[i] == '\'')
			count++;

	if (count == 0)
		return g_strdup (text);

	escaped = g_malloc (len + count + 1);

	j = 0;
	for (i = 0; i <= len; i++) {
		if (text[i] == '\'') {
			escaped[j] = '\\';
			j++;
		}
		escaped[j] = text[i];
		j++;
	}

	return escaped;
}

static JSValueRef
get_user_name_cb(JSContextRef context,
				 JSObjectRef thisObject,
				 JSStringRef propertyName,
				 JSValueRef *exception) {
	LightDMUser *user = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_user_get_name(user)));
}


static JSValueRef
get_user_real_name_cb(JSContextRef context,
					  JSObjectRef thisObject,
					  JSStringRef propertyName,
					  JSValueRef *exception) {
	LightDMUser *user = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_user_get_real_name(user)));
}


static JSValueRef
get_user_display_name_cb(JSContextRef context,
						 JSObjectRef thisObject,
						 JSStringRef propertyName,
						 JSValueRef *exception) {
	LightDMUser *user = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_user_get_display_name(user)));
}


static JSValueRef
get_user_home_directory_cb(JSContextRef context,
						 JSObjectRef thisObject,
						 JSStringRef propertyName,
						 JSValueRef *exception) {
	LightDMUser *user = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_user_get_home_directory(user)));
}

static JSValueRef
get_user_image_cb(JSContextRef context,
				  JSObjectRef thisObject,
				  JSStringRef propertyName,
				  JSValueRef *exception) {
	LightDMUser *user = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_user_get_image(user)));
}


static JSValueRef
get_user_language_cb(JSContextRef context,
					 JSObjectRef thisObject,
					 JSStringRef propertyName,
					 JSValueRef *exception) {
	LightDMUser *user     = JSObjectGetPrivate(thisObject);
	const gchar *language = lightdm_user_get_language(user);

	if (!language) {
		return JSValueMakeNull(context);
	}

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(language));
}


static JSValueRef
get_user_layout_cb(JSContextRef context,
				   JSObjectRef thisObject,
				   JSStringRef propertyName,
				   JSValueRef *exception) {
	LightDMUser *user   = JSObjectGetPrivate(thisObject);
	const gchar *layout = lightdm_user_get_layout(user);

	if (!layout) {
		return JSValueMakeNull(context);
	}

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(layout));
}


static JSValueRef
get_user_session_cb(JSContextRef context,
					JSObjectRef thisObject,
					JSStringRef propertyName,
					JSValueRef *exception) {
	LightDMUser *user    = JSObjectGetPrivate(thisObject);
	const gchar *session = lightdm_user_get_session(user);

	if (!session) {
		return JSValueMakeNull(context);
	}

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(session));
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

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_language_get_code(language)));
}


static JSValueRef
get_language_name_cb(JSContextRef context,
					 JSObjectRef thisObject,
					 JSStringRef propertyName,
					 JSValueRef *exception) {
	LightDMLanguage *language = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_language_get_name(language)));
}


static JSValueRef
get_language_territory_cb(JSContextRef context,
						  JSObjectRef thisObject,
						  JSStringRef propertyName,
						  JSValueRef *exception) {
	LightDMLanguage *language = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_language_get_territory(language)));
}


static JSValueRef
get_layout_name_cb(JSContextRef context,
				   JSObjectRef thisObject,
				   JSStringRef propertyName,
				   JSValueRef *exception) {
	LightDMLayout *layout = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_layout_get_name(layout)));
}


static JSValueRef
get_layout_short_description_cb(JSContextRef context,
								JSObjectRef thisObject,
								JSStringRef propertyName,
								JSValueRef *exception) {
	LightDMLayout *layout = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_layout_get_short_description(layout)));
}


static JSValueRef
get_layout_description_cb(JSContextRef context,
						  JSObjectRef thisObject,
						  JSStringRef propertyName,
						  JSValueRef *exception) {
	LightDMLayout *layout = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_layout_get_description(layout)));
}


static JSValueRef
get_session_key_cb(JSContextRef context,
				   JSObjectRef thisObject,
				   JSStringRef propertyName,
				   JSValueRef *exception) {
	LightDMSession *session = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_session_get_key(session)));
}


static JSValueRef
get_session_name_cb(JSContextRef context,
					JSObjectRef thisObject,
					JSStringRef propertyName,
					JSValueRef *exception) {
	LightDMSession *session = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_session_get_name(session)));
}


static JSValueRef
get_session_comment_cb(JSContextRef context,
					   JSObjectRef thisObject,
					   JSStringRef propertyName,
					   JSValueRef *exception) {
	LightDMSession *session = JSObjectGetPrivate(thisObject);

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_session_get_comment(session)));
}


static JSValueRef
get_hostname_cb(JSContextRef context,
				JSObjectRef thisObject,
				JSStringRef propertyName,
				JSValueRef *exception) {
	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_get_hostname()));
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
	guint       i, n_users = 0;
	JSValueRef  *args;

	users   = lightdm_user_list_get_users(lightdm_user_list_get_instance());
	n_users = g_list_length((GList *) users);
	args    = g_malloc(sizeof(JSValueRef) * ( n_users + 1 ));
	for (i  = 0, link = users; link; i++, link = link->next) {
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
	guint       i, n_languages = 0;
	JSValueRef  *args;

	languages   = lightdm_get_languages();
	n_languages = g_list_length((GList *) languages);
	args        = g_malloc(sizeof(JSValueRef) * ( n_languages + 1 ));
	for (i      = 0, link = languages; link; i++, link = link->next) {
		LightDMLanguage *language = link->data;
		g_object_ref(language);
		args[i] = JSObjectMake(context, lightdm_language_class, language);
	}

	array = JSObjectMakeArray(context, n_languages, args, NULL);
	g_free(args);
	return array;
}


static JSValueRef
get_language_cb(JSContextRef context,
						JSObjectRef thisObject,
						JSStringRef propertyName,
						JSValueRef *exception) {
	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_language_get_name((LightDMLanguage *) lightdm_get_language())));
}

static JSValueRef
get_layouts_cb(JSContextRef context,
			   JSObjectRef thisObject,
			   JSStringRef propertyName,
			   JSValueRef *exception) {

	JSObjectRef array;
	const GList *layouts, *link;
	guint       i, n_layouts = 0;
	JSValueRef  *args;

	layouts   = lightdm_get_layouts();
	n_layouts = g_list_length((GList *) layouts);
	args      = g_malloc(sizeof(JSValueRef) * ( n_layouts + 1 ));
	for (i    = 0, link = layouts; link; i++, link = link->next) {
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
	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_layout_get_name(lightdm_get_layout())));
}


static bool
set_layout_cb(JSContextRef context,
			  JSObjectRef thisObject,
			  JSStringRef propertyName,
			  JSValueRef value,
			  JSValueRef *exception) {
	JSStringRef layout_arg;
	size_t	    layout_size;
	gchar       *layout;
	const GList *layouts, *link;

	if (JSValueGetType(context, value) != kJSTypeString) {
		JSStringRef string = JSStringCreateWithUTF8CString("Expected a string");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return false;
	}

	layout_arg = JSValueToStringCopy(context, value, NULL);
	layout_size = JSStringGetMaximumUTF8CStringSize(layout_arg);
	layout = g_malloc (layout_size);
	JSStringGetUTF8CString(layout_arg, layout, layout_size);
	JSStringRelease(layout_arg);

	layouts = lightdm_get_layouts ();
	for (link = layouts; link; link = link->next)
	{
		LightDMLayout *currlayout = link->data;
		if (!(g_strcmp0(lightdm_layout_get_name(currlayout), layout))) {
			g_object_ref (currlayout);
			lightdm_set_layout (currlayout);
			break;
		}
	}

	g_free (layout);
	return true;
}


static JSValueRef
get_sessions_cb(JSContextRef context,
				JSObjectRef thisObject,
				JSStringRef propertyName,
				JSValueRef *exception) {
	JSObjectRef array;
	const GList *sessions, *link;
	guint       i, n_sessions = 0;
	JSValueRef  *args;

	sessions   = lightdm_get_sessions();
	n_sessions = g_list_length((GList *) sessions);
	args       = g_malloc(sizeof(JSValueRef) * ( n_sessions + 1 ));
	for (i     = 0, link = sessions; link; i++, link = link->next) {
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

	return JSValueMakeString(context, JSStringCreateWithUTF8CString(lightdm_greeter_get_default_session_hint(greeter)));
}


static JSValueRef
get_lock_hint_cb(JSContextRef context,
				 JSObjectRef thisObject,
				 JSStringRef propertyName,
				 JSValueRef *exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);

	return JSValueMakeBoolean(context, lightdm_greeter_get_lock_hint(greeter));
}


static JSValueRef
get_autologin_timeout_cb(JSContextRef context,
						 JSObjectRef thisObject,
						 JSStringRef propertyName,
						 JSValueRef *exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);

	return JSValueMakeNumber(context, lightdm_greeter_get_autologin_timeout_hint(greeter));
}


static JSValueRef
cancel_autologin_cb(JSContextRef context,
					  JSObjectRef function,
					  JSObjectRef thisObject,
					  size_t argumentCount,
					  const JSValueRef arguments[],
					  JSValueRef *exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);

	if (argumentCount != 0) {
		JSStringRef string = JSStringCreateWithUTF8CString("Argument count not zero");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

	lightdm_greeter_cancel_autologin(greeter);
	return JSValueMakeNull(context);
}


static JSValueRef
authenticate_cb(JSContextRef context,
						JSObjectRef function,
						JSObjectRef thisObject,
						size_t argumentCount,
						const JSValueRef arguments[],
						JSValueRef *exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
	JSStringRef    name_arg;
	size_t         name_size;
	gchar          *name;

	if (!( argumentCount == 1 && JSValueGetType(context, arguments[0]) == kJSTypeString )) {
		JSStringRef string = JSStringCreateWithUTF8CString("Username argument not supplied");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

	name_arg = JSValueToStringCopy(context, arguments[0], NULL);
	name_size = JSStringGetMaximumUTF8CStringSize(name_arg);
	name = g_malloc (name_size);
	JSStringGetUTF8CString(name_arg, name, name_size);
	JSStringRelease(name_arg);

        if (*name == '\0')
	        lightdm_greeter_authenticate(greeter, NULL);
        else
	        lightdm_greeter_authenticate(greeter, name);

	g_free (name);
	return JSValueMakeNull(context);
}

static JSValueRef
authenticate_as_guest_cb (JSContextRef context,
				JSObjectRef function,
				JSObjectRef thisObject,
				size_t argumentCount,
				const JSValueRef arguments[],
				JSValueRef * exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate (thisObject);

	if (argumentCount != 0) {
		JSStringRef string = JSStringCreateWithUTF8CString ("Argument count not zero");
		JSValueRef exceptionString = JSValueMakeString (context, string);
		JSStringRelease (string);
		*exception = JSValueToObject (context, exceptionString, NULL);
		return JSValueMakeNull (context);
	}

	lightdm_greeter_authenticate_as_guest (greeter);

	return JSValueMakeNull (context);
}

static JSValueRef
get_hint_cb (JSContextRef context,
					JSObjectRef function,
					JSObjectRef thisObject,
					size_t argumentCount,
					const JSValueRef arguments[],
					JSValueRef * exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate (thisObject);
	JSStringRef hint_arg;
	size_t hint_size;
	gchar *hint_name;
	JSStringRef hint;

	if (!(argumentCount == 1 && JSValueGetType (context, arguments[0]) == kJSTypeString)) {
		JSStringRef string = JSStringCreateWithUTF8CString ("Hint argument not supplied");
		JSValueRef exceptionString = JSValueMakeString (context, string);
		JSStringRelease (string);
		*exception = JSValueToObject (context, exceptionString, NULL);
		return JSValueMakeNull (context);
	}

	hint_arg = JSValueToStringCopy (context, arguments[0], NULL);
	hint_size = JSStringGetMaximumUTF8CStringSize (hint_arg);
	hint_name = g_malloc (hint_size);
	JSStringGetUTF8CString (hint_arg, hint_name, hint_size);
	JSStringRelease (hint_arg);

	hint = JSStringCreateWithUTF8CString (lightdm_greeter_get_hint (greeter, hint_name));

	g_free (hint_name);

	return JSValueMakeString (context, hint);
}


static JSValueRef
respond_cb(JSContextRef context,
				  JSObjectRef function,
				  JSObjectRef thisObject,
				  size_t argumentCount,
				  const JSValueRef arguments[],
				  JSValueRef *exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
	JSStringRef    response_arg;
	size_t         response_size;
	gchar          *response;

	if (!( argumentCount == 1 && JSValueGetType(context, arguments[0]) == kJSTypeString )) {
		JSStringRef string = JSStringCreateWithUTF8CString("Response not supplied");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

	response_arg = JSValueToStringCopy(context, arguments[0], NULL);
	response_size = JSStringGetMaximumUTF8CStringSize(response_arg);
	response = g_malloc (response_size);
	JSStringGetUTF8CString(response_arg, response, response_size);
	JSStringRelease(response_arg);

	lightdm_greeter_respond(greeter, response);

	g_free (response);
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

	if (argumentCount != 0) {
		JSStringRef string = JSStringCreateWithUTF8CString("Argument count not zero");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

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
get_has_guest_account_cb (JSContextRef context, 
						JSObjectRef thisObject,
						JSStringRef propertyName,
						JSValueRef * exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate (thisObject);
	return JSValueMakeBoolean (context, lightdm_greeter_get_has_guest_account_hint (greeter));
}

static JSValueRef
get_hide_users_cb (JSContextRef context,
						JSObjectRef thisObject,
						JSStringRef propertyName,
						JSValueRef * exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate (thisObject);
	return JSValueMakeBoolean (context, lightdm_greeter_get_hide_users_hint (greeter));
}

static JSValueRef
get_select_user_cb (JSContextRef context,
						JSObjectRef thisObject,
						JSStringRef propertyName,
						JSValueRef * exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate (thisObject);
	return JSValueMakeString (context, JSStringCreateWithUTF8CString (lightdm_greeter_get_select_user_hint (greeter)));
}

static JSValueRef
get_select_guest_cb (JSContextRef context,
						JSObjectRef thisObject,
						JSStringRef propertyName,
						JSValueRef * exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate (thisObject);
	return JSValueMakeBoolean (context, lightdm_greeter_get_select_guest_hint (greeter));
}

static JSValueRef
get_autologin_user_cb (JSContextRef context,
						JSObjectRef thisObject,
						JSStringRef propertyName,
						JSValueRef * exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate (thisObject);
	return JSValueMakeString (context, JSStringCreateWithUTF8CString (lightdm_greeter_get_autologin_user_hint (greeter)));
}

static JSValueRef
get_autologin_guest_cb (JSContextRef context,
						JSObjectRef thisObject,
						JSStringRef propertyName,
						JSValueRef * exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate (thisObject);
	return JSValueMakeBoolean (context, lightdm_greeter_get_autologin_guest_hint (greeter));
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
get_in_authentication_cb(JSContextRef context,
						JSObjectRef thisObject,
						JSStringRef propertyName,
						JSValueRef *exception) {
	LightDMGreeter *greeter = JSObjectGetPrivate(thisObject);
	return JSValueMakeBoolean(context, lightdm_greeter_get_in_authentication(greeter));
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
	if (argumentCount != 0) {
		JSStringRef string = JSStringCreateWithUTF8CString("Argument count not zero");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

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
	if (argumentCount != 0) {
		JSStringRef string = JSStringCreateWithUTF8CString("Argument count not zero");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

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
	if (argumentCount != 0) {
		JSStringRef string = JSStringCreateWithUTF8CString("Argument count not zero");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

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
	if (argumentCount != 0) {
		JSStringRef string = JSStringCreateWithUTF8CString("Argument count not zero");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

	lightdm_shutdown(NULL);
	return JSValueMakeNull(context);
}


static JSValueRef
start_session_sync_cb(JSContextRef context,
		 JSObjectRef function,
		 JSObjectRef thisObject,
		 size_t argumentCount,
		 const JSValueRef arguments[],
		 JSValueRef *exception) {
	LightDMGreeter *greeter                 = JSObjectGetPrivate(thisObject);
	JSStringRef    arg;
	size_t         username_size, session_size;
	gchar          *username, *session = NULL;

	if (!((argumentCount == 1 && JSValueGetType (context, arguments[0]) == kJSTypeString) ||
	      (argumentCount == 2 && JSValueGetType (context, arguments[0]) == kJSTypeString && JSValueGetType (context, arguments[1]) == kJSTypeString))) {
		JSStringRef string = JSStringCreateWithUTF8CString("Username or Session incorrect");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull (context);
	}

	arg = JSValueToStringCopy(context, arguments[0], NULL);
	username_size = JSStringGetMaximumUTF8CStringSize(arg);
	username = g_malloc (username_size);
	JSStringGetUTF8CString(arg, username, username_size);
	JSStringRelease(arg);

	if (argumentCount > 1) {
		arg     = JSValueToStringCopy(context, arguments[1], NULL);
		session_size = JSStringGetMaximumUTF8CStringSize(arg);
		session = g_malloc (session_size);
		JSStringGetUTF8CString(arg, session, session_size);
		JSStringRelease(arg);
	}

	lightdm_greeter_start_session_sync(greeter, session, NULL);

        g_free(username);
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
	JSStringRef    arg;
	size_t         language_size;
	gchar          *language;

	if (!(argumentCount == 1 && JSValueGetType (context, arguments[0]) == kJSTypeString)) {
		JSStringRef string = JSStringCreateWithUTF8CString("Language not supplied");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return false;
	}

	arg = JSValueToStringCopy(context, arguments[0], NULL);
	language_size = JSStringGetMaximumUTF8CStringSize(arg);
	language = g_malloc (language_size);
	JSStringGetUTF8CString(arg, language, language_size);
	JSStringRelease(arg);

	lightdm_greeter_set_language(greeter, language);

	g_free (language);
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
	size_t      string_size;
	gchar       *string;

	if (!(argumentCount == 1 && JSValueGetType (context, arguments[0]) == kJSTypeString)) {
		JSStringRef string = JSStringCreateWithUTF8CString("Argument not supplied");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

	string_arg = JSValueToStringCopy(context, arguments[0], NULL);
	string_size = JSStringGetMaximumUTF8CStringSize(string_arg);
	string = g_malloc (string_size);
	JSStringGetUTF8CString(string_arg, string, string_size);
	JSStringRelease(string_arg);

	result = JSStringCreateWithUTF8CString(gettext(string));
	g_free (string);
	return JSValueMakeString(context, result);
}


static JSValueRef
ngettext_cb(JSContextRef context,
			JSObjectRef function,
			JSObjectRef thisObject,
			size_t argumentCount,
			const JSValueRef arguments[],
			JSValueRef *exception) {
	JSStringRef  string_arg, plural_string_arg, result;
	size_t       string_size, plural_string_size;
	gchar        *string, *plural_string;
	unsigned int n;

	if (argumentCount != 3) {
		JSStringRef string = JSStringCreateWithUTF8CString("Needs 3 arguments");
		JSValueRef exceptionString = JSValueMakeString(context, string);
		JSStringRelease(string);
		*exception = JSValueToObject(context, exceptionString, NULL);
		return JSValueMakeNull(context);
	}

	string_arg = JSValueToStringCopy(context, arguments[0], NULL);
	string_size = JSStringGetMaximumUTF8CStringSize(string_arg);
	string = g_malloc (string_size);
	JSStringGetUTF8CString(string_arg, string, string_size);
	JSStringRelease(string_arg);

	plural_string_arg = JSValueToStringCopy(context, arguments[1], NULL);
	plural_string_size = JSStringGetMaximumUTF8CStringSize(plural_string_arg);
	plural_string = g_malloc (plural_string_size);
	JSStringGetUTF8CString(plural_string_arg, string, plural_string_size);
	JSStringRelease(plural_string_arg);

	n = JSValueToNumber(context, arguments[2], NULL);

	result = JSStringCreateWithUTF8CString(ngettext(string, plural_string, n));
	g_free (string);
	g_free (plural_string);
	return JSValueMakeString(context, result);
}


static const JSStaticValue lightdm_user_values[] = {
	{"name",           get_user_name_cb,           NULL, kJSPropertyAttributeReadOnly},
	{"real_name",      get_user_real_name_cb,      NULL, kJSPropertyAttributeReadOnly},
	{"display_name",   get_user_display_name_cb,   NULL, kJSPropertyAttributeReadOnly},
	{"home_directory", get_user_home_directory_cb, NULL, kJSPropertyAttributeReadOnly},
	{"image",          get_user_image_cb,          NULL, kJSPropertyAttributeReadOnly},
	{"language",       get_user_language_cb,       NULL, kJSPropertyAttributeReadOnly},
	{"layout",         get_user_layout_cb,         NULL, kJSPropertyAttributeReadOnly},
	{"session",        get_user_session_cb,        NULL, kJSPropertyAttributeReadOnly},
	{"logged_in",      get_user_logged_in_cb,      NULL, kJSPropertyAttributeReadOnly},
	{NULL,             NULL,                       NULL, 0}};

static const JSStaticValue lightdm_language_values[] = {
	{"code",      get_language_code_cb,      NULL, kJSPropertyAttributeReadOnly},
	{"name",      get_language_name_cb,      NULL, kJSPropertyAttributeReadOnly},
	{"territory", get_language_territory_cb, NULL, kJSPropertyAttributeReadOnly},
	{NULL,        NULL,                      NULL, 0}};

static const JSStaticValue lightdm_layout_values[] = {
	{"name",              get_layout_name_cb,              NULL, kJSPropertyAttributeReadOnly},
	{"short_description", get_layout_short_description_cb, NULL, kJSPropertyAttributeReadOnly},
	{"description",       get_layout_description_cb,       NULL, kJSPropertyAttributeReadOnly},
	{NULL,                NULL,                            NULL, 0}};

static const JSStaticValue lightdm_session_values[] = {
	{"key",     get_session_key_cb,     NULL, kJSPropertyAttributeReadOnly},
	{"name",    get_session_name_cb,    NULL, kJSPropertyAttributeReadOnly},
	{"comment", get_session_comment_cb, NULL, kJSPropertyAttributeReadOnly},
	{NULL,      NULL,                   NULL, 0}};

static const JSStaticValue lightdm_greeter_values[] = {
	{"hostname",            get_hostname_cb,            NULL,          kJSPropertyAttributeReadOnly},
	{"users",               get_users_cb,               NULL,          kJSPropertyAttributeReadOnly},
	{"default_language",    get_language_cb,            NULL,          kJSPropertyAttributeReadOnly}, /* Deprecated */
	{"language",            get_language_cb,            NULL,          kJSPropertyAttributeReadOnly},
	{"languages",           get_languages_cb,           NULL,          kJSPropertyAttributeReadOnly},
	{"default_layout",      get_layout_cb,              NULL,          kJSPropertyAttributeReadOnly}, /* Deprecated */
	{"layouts",             get_layouts_cb,             NULL,          kJSPropertyAttributeReadOnly},
	{"layout",              get_layout_cb,              set_layout_cb, kJSPropertyAttributeNone},
	{"sessions",            get_sessions_cb,            NULL,          kJSPropertyAttributeReadOnly},
	{"num_users",           get_num_users_cb,           NULL,          kJSPropertyAttributeReadOnly},
	{"default_session",     get_default_session_cb,     NULL,          kJSPropertyAttributeReadOnly},
	{"timed_login_user",    get_autologin_user_cb,      NULL,          kJSPropertyAttributeReadOnly}, /* Deprecated */
	{"timed_login_delay",   get_autologin_timeout_cb,   NULL,          kJSPropertyAttributeReadOnly}, /* Deprecated */
	{"authentication_user", get_authentication_user_cb, NULL,          kJSPropertyAttributeReadOnly},
	{"in_authentication",   get_in_authentication_cb,   NULL,          kJSPropertyAttributeReadOnly},
	{"is_authenticated",    get_is_authenticated_cb,    NULL,          kJSPropertyAttributeReadOnly},
	{"can_suspend",         get_can_suspend_cb,         NULL,          kJSPropertyAttributeReadOnly},
	{"can_hibernate",       get_can_hibernate_cb,       NULL,          kJSPropertyAttributeReadOnly},
	{"can_restart",         get_can_restart_cb,         NULL,          kJSPropertyAttributeReadOnly},
	{"can_shutdown",        get_can_shutdown_cb,        NULL,          kJSPropertyAttributeReadOnly},
	{"lock_hint",           get_lock_hint_cb,           NULL,          kJSPropertyAttributeReadOnly},
	{"has_guest_account",   get_has_guest_account_cb,   NULL,          kJSPropertyAttributeReadOnly},
	{"hide_users",          get_hide_users_cb,          NULL,          kJSPropertyAttributeReadOnly},
	{"select_user",         get_select_user_cb,         NULL,          kJSPropertyAttributeReadOnly},
	{"select_guest",        get_select_guest_cb,        NULL,          kJSPropertyAttributeReadOnly},
	{"autologin_user",      get_autologin_user_cb,      NULL,          kJSPropertyAttributeReadOnly},
	{"autologin_guest",     get_autologin_guest_cb,     NULL,          kJSPropertyAttributeReadOnly},
	{"autologin_timeout",   get_autologin_timeout_cb,   NULL,          kJSPropertyAttributeReadOnly},
	{NULL,                  NULL,                       NULL,          0}};

static const JSStaticFunction lightdm_greeter_functions[] = {
	{"cancel_timed_login",    cancel_autologin_cb,      kJSPropertyAttributeReadOnly}, /* Deprecated */
	{"cancel_autologin",      cancel_autologin_cb,      kJSPropertyAttributeReadOnly},
	{"start_authentication",  authenticate_cb,          kJSPropertyAttributeReadOnly}, /* Deprecated */
	{"authenticate",          authenticate_cb,          kJSPropertyAttributeReadOnly},
	{"authenticate_as_guest", authenticate_as_guest_cb, kJSPropertyAttributeReadOnly},
	{"respond",               respond_cb,               kJSPropertyAttributeReadOnly},
	{"provide_secret",        respond_cb,               kJSPropertyAttributeReadOnly},  /* Deprecated */
	{"cancel_authentication", cancel_authentication_cb, kJSPropertyAttributeReadOnly},
	{"suspend",               suspend_cb,               kJSPropertyAttributeReadOnly},
	{"hibernate",             hibernate_cb,             kJSPropertyAttributeReadOnly},
	{"restart",               restart_cb,               kJSPropertyAttributeReadOnly},
	{"shutdown",              shutdown_cb,              kJSPropertyAttributeReadOnly},
	{"set_language",          set_language_cb,          kJSPropertyAttributeReadOnly},
	{"login",                 start_session_sync_cb,    kJSPropertyAttributeReadOnly}, /* Deprecated */
	{"start_session_sync",    start_session_sync_cb,    kJSPropertyAttributeReadOnly},
	{"get_hint",              get_hint_cb,              kJSPropertyAttributeReadOnly},
	{NULL,                    NULL,                     0}};

static const JSStaticFunction gettext_functions[] = {
	{"gettext",  gettext_cb,  kJSPropertyAttributeReadOnly},
	{"ngettext", ngettext_cb, kJSPropertyAttributeReadOnly},
	{NULL,       NULL,        0}};

static const JSClassDefinition lightdm_user_definition = {
	0,                     /* Version       */
	kJSClassAttributeNone, /* Attributes    */
	"LightDMUser",         /* Class name    */
	NULL,                  /* Parent class  */
	lightdm_user_values,   /* Static values */
};

static const JSClassDefinition lightdm_language_definition = {
	0,                       /* Version       */
	kJSClassAttributeNone,   /* Attributes    */
	"LightDMLanguage",       /* Class name    */
	NULL,                    /* Parent class  */
	lightdm_language_values, /* Static values */
};

static const JSClassDefinition lightdm_layout_definition = {
	0,                     /* Version       */
	kJSClassAttributeNone, /* Attributes    */
	"LightDMLayout",       /* Class name    */
	NULL,                  /* Parent class  */
	lightdm_layout_values, /* Static values */
};

static const JSClassDefinition lightdm_session_definition = {
	0,                      /* Version       */
	kJSClassAttributeNone,  /* Attributes    */
	"LightDMSession",       /* Class name    */
	NULL,                   /* Parent class  */
	lightdm_session_values, /* Static values */
};

static const JSClassDefinition lightdm_greeter_definition = {
	0,                         /* Version          */
	kJSClassAttributeNone,     /* Attributes       */
	"LightDMGreeter",          /* Class name       */
	NULL,                      /* Parent class     */
	lightdm_greeter_values,    /* Static values    */
	lightdm_greeter_functions, /* Static functions */
};

static const JSClassDefinition gettext_definition = {
	0,                     /* Version          */
	kJSClassAttributeNone, /* Attributes       */
	"GettextClass",        /* Class name       */
	NULL,                  /* Parent class     */
	NULL,                  /* Static values    */
	gettext_functions,     /* Static functions */
};


/*static void
web_page_created_callback(WebKitWebExtension *extension, WebKitWebPage *web_page, gpointer user_data) {

	g_print("Page %" G_GUINT64_FORMAT "created for %s\n",
			webkit_web_page_get_id(web_page),
			webkit_web_page_get_uri(web_page)
	);

}*/


static void
window_object_cleared_callback(WebKitScriptWorld *world,
							   WebKitWebPage *web_page,
							   WebKitFrame *frame,
							   LightDMGreeter *greeter) {
	JSObjectRef        gettext_object, lightdm_greeter_object;
	JSGlobalContextRef jsContext;
	JSObjectRef        globalObject;
	WebKitDOMDocument  *dom_document;
	WebKitDOMDOMWindow *dom_window;
	gchar              *message = "LockHint";

	page_id = webkit_web_page_get_id(web_page);

	jsContext    = webkit_frame_get_javascript_context_for_script_world(frame, world);
	globalObject = JSContextGetGlobalObject(jsContext);

	gettext_class          = JSClassCreate(&gettext_definition);
	lightdm_greeter_class  = JSClassCreate(&lightdm_greeter_definition);
	lightdm_user_class     = JSClassCreate(&lightdm_user_definition);
	lightdm_language_class = JSClassCreate(&lightdm_language_definition);
	lightdm_layout_class   = JSClassCreate(&lightdm_layout_definition);
	lightdm_session_class  = JSClassCreate(&lightdm_session_definition);

	gettext_object = JSObjectMake(jsContext, gettext_class, NULL);
	JSObjectSetProperty(jsContext,
						globalObject,
						JSStringCreateWithUTF8CString("gettext"),
						gettext_object,
						kJSPropertyAttributeNone,
						NULL);

	lightdm_greeter_object = JSObjectMake(jsContext, lightdm_greeter_class, greeter);
	JSObjectSetProperty(jsContext,
						globalObject,
						JSStringCreateWithUTF8CString("lightdm"),
						lightdm_greeter_object,
						kJSPropertyAttributeNone,
						NULL);

	// If lightdm was started as a lock-screen, send signal to our UI process.
	if (lightdm_greeter_get_lock_hint(greeter)) {
		dom_document = webkit_web_page_get_dom_document(web_page);
		dom_window   = webkit_dom_document_get_default_view(dom_document);

		if (dom_window) {
			webkit_dom_dom_window_webkit_message_handlers_post_message(dom_window, "GreeterBridge", message);
		}
	}

}


static void
show_prompt_cb(LightDMGreeter *greeter,
			   const gchar *text,
			   LightDMPromptType type,
			   WebKitWebExtension *extension) {

	WebKitWebPage      *web_page;
	WebKitFrame        *web_frame;
	JSGlobalContextRef jsContext;
	JSStringRef        command;
	gchar              *string;
	gchar              *etext;
        const gchar        *ct = "";

	web_page = webkit_web_extension_get_page(extension, page_id);

	if (web_page != NULL) {
		web_frame = webkit_web_page_get_main_frame(web_page);

		jsContext = webkit_frame_get_javascript_global_context(web_frame);

                switch (type) {
                        case LIGHTDM_PROMPT_TYPE_QUESTION:
                                ct = "text";
                                break;
                        case LIGHTDM_PROMPT_TYPE_SECRET:
                                ct = "password";
                                break;
                }
 
		etext   = escape (text);
                string  = g_strdup_printf ("show_prompt('%s', '%s')", etext, ct);
		command = JSStringCreateWithUTF8CString(string);

		JSEvaluateScript(jsContext, command, NULL, NULL, 0, NULL);

		g_free(string);
                g_free(etext);
	}
}


static void
show_message_cb(LightDMGreeter *greeter,
				const gchar *text,
				LightDMMessageType type,
				WebKitWebExtension *extension) {

	WebKitWebPage      *web_page;
	WebKitFrame        *web_frame;
	JSGlobalContextRef jsContext;
	JSStringRef        command;
	gchar              *etext;
	gchar              *string;
        const gchar        *mt = "";

	web_page = webkit_web_extension_get_page(extension, page_id);
	if (web_page != NULL) {
		web_frame = webkit_web_page_get_main_frame(web_page);

		jsContext = webkit_frame_get_javascript_global_context(web_frame);

                switch (type) {
                        case LIGHTDM_MESSAGE_TYPE_ERROR:
                                mt = "error";
                                break;
                        case LIGHTDM_MESSAGE_TYPE_INFO:
                                mt = "info";
                                break;
                }
 
		etext   = escape (text);
                string  = g_strdup_printf ("show_prompt('%s', '%s')", etext, mt);
		command = JSStringCreateWithUTF8CString(string);

		JSEvaluateScript(jsContext, command, NULL, NULL, 0, NULL);

		g_free(string);
		g_free(etext);
	}
}


static void
authentication_complete_cb(LightDMGreeter *greeter, WebKitWebExtension *extension) {

	WebKitWebPage      *web_page;
	WebKitFrame        *web_frame;
	JSGlobalContextRef jsContext;
	JSStringRef        command;

	web_page = webkit_web_extension_get_page(extension, page_id);

	if (web_page != NULL) {
		web_frame = webkit_web_page_get_main_frame(web_page);

		jsContext = webkit_frame_get_javascript_global_context(web_frame);

		command = JSStringCreateWithUTF8CString("authentication_complete()");

		JSEvaluateScript(jsContext, command, NULL, NULL, 0, NULL);
	}
}

static void
autologin_timer_expired_cb(LightDMGreeter *greeter, WebKitWebExtension *extension) {

	WebKitWebPage      *web_page;
	WebKitFrame        *web_frame;
	JSGlobalContextRef jsContext;
	JSStringRef        command;

	web_page = webkit_web_extension_get_page(extension, page_id);

	if (web_page != NULL) {
		web_frame = webkit_web_page_get_main_frame(web_page);

		jsContext = webkit_frame_get_javascript_global_context(web_frame);

		command = JSStringCreateWithUTF8CString("autologin_timer_expired()");

		JSEvaluateScript(jsContext, command, NULL, NULL, 0, NULL);
	}
}


G_MODULE_EXPORT void
webkit_web_extension_initialize(WebKitWebExtension *extension) {
	LightDMGreeter *greeter = lightdm_greeter_new();

	g_signal_connect(G_OBJECT(greeter), "authentication-complete", G_CALLBACK(authentication_complete_cb), extension);
	g_signal_connect(G_OBJECT(greeter), "show-prompt", G_CALLBACK(show_prompt_cb), extension);
	g_signal_connect(G_OBJECT(greeter), "show-message", G_CALLBACK(show_message_cb), extension);
	g_signal_connect(G_OBJECT(greeter), "autologin-timer-expired", G_CALLBACK(autologin_timer_expired_cb), extension);

	g_signal_connect(webkit_script_world_get_default(),
					 "window-object-cleared",
					 G_CALLBACK(window_object_cleared_callback),
					 greeter);

	lightdm_greeter_connect_sync(greeter, NULL);
}

