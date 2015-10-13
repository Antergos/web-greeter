webextension_LTLIBRARIES = liblightdm-webkit2-greeter-ext.la
webextensiondir = $(libdir)/lightdm-webkit2-greeter

liblightdm_webkit2_greeter_ext_la_SOURCES = \
	lightdm-webkit2-greeter-ext.c

liblightdm_webkit2_greeter_ext_la_CFLAGS = \
	$(GREETER_CFLAGS) \
	$(WARN_CFLAGS) \
	-DVERSION=\"$(VERSION)\" \
	-DLOCALE_DIR=\"$(localedir)\" \
	 $(WEB_EXTENSION_CFLAGS)

liblightdm_webkit2_greeter_ext_la_LIBADD = \
	$(WEB_EXTENSION_LIBS) \
	$(GREETER_LIBS)

liblightdm_webkit2_greeter_ext_la_LDFLAGS = -module -avoid-version -no-undefined

greeter_PROGRAMS = lightdm-webkit2-greeter
greeterdir = $(bindir)

lightdm_webkit2_greeter_SOURCES = \
	lightdm-webkit2-greeter.c

myapp_CPPFLAGS = 

lightdm_webkit2_greeter_CFLAGS = \
	$(GREETER_CFLAGS) \
	$(WARN_CFLAGS) \
	-DLIGHTDM_WEBKIT2_GREETER_EXTENSIONS_DIR=\""$(libdir)/lightdm-webkit2-greeter"\" \
	-DVERSION=\"$(VERSION)\" \
	-DGETTEXT_PACKAGE=\"$(GETTEXT_PACKAGE)\" \
	-DLOCALE_DIR=\"$(localedir)\" \
	-DBINARY=\"lightdm-webkit2-greeter\"

lightdm_webkit2_greeter_LDADD = \
	$(GREETER_LIBS)

DISTCLEANFILES = \
	Makefile.in
