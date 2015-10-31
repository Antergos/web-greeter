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

liblightdm_webkit2_greeter_ext_LDADD = \
    $(WEB_EXTENSION_LIBS) \
	$(GREETER_LIBS)

liblightdm_webkit2_greeter_ext_la_LDFLAGS = -module -avoid-version -no-undefined

greeter_PROGRAMS = lightdm-webkit2-greeter
greeterdir = $(bindir)

lightdm_webkit2_greeter_built_sources = \
	lightdm-webkit2-greeter-css-application.h

lightdm_webkit2_greeter_SOURCES = \
	$(lightdm_webkit2_greeter_built_sources) \
	lightdm-webkit2-greeter.c

lightdm_webkit2_greeter_CFLAGS = \
	$(GREETER_CFLAGS) \
	$(WARN_CFLAGS) \
	-DLIGHTDM_WEBKIT2_GREETER_EXTENSIONS_DIR=\""$(libdir)/lightdm-webkit2-greeter"\" \
	-DVERSION=\"$(VERSION)\" \
	-DLOCALE_DIR=\"$(localedir)\" \
	-DBINARY=\"lightdm-webkit2-greeter\"

lightdm_webkit2_greeter_LDADD = \
	$(GREETER_LIBS) \
	$(WEB_EXTENSION_LIBS) \
	$(LIBX11_LIBS)

lightdm-webkit2-greeter-css-application.h: $(srcdir)/lightdm-webkit2-greeter-application.css Makefile
	$(AM_V_GEN) exo-csource --static --name=lightdm_webkit2_greeter_css_application $< >$@

BUILT_SOURCES = \
	$(lightdm_webkit2_greeter_built_sources)

DISTCLEANFILES = \
	Makefile.in \
	$(lightdm_webkit2_greeter_built_sources)

EXTRA_DIST = \
	lightdm-webkit2-greeter-application.css
