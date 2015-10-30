etcdir = /etc/lightdm/
etc_DATA = \
	lightdm-webkit2-greeter.conf \
	lightdm-webkit2-greeter-compton.conf

dist_bin_SCRIPTS = lightdm-webkit2-greeter-start

desktopdir = $(DESKTOP_DIR)
desktop_DATA = lightdm-webkit2-greeter.desktop

EXTRA_DIST = \
	$(etc_DATA) \
	$(desktop_DATA) \
	$(dist_bin_SCRIPTS)

DISTCLEANFILES = \
	Makefile.in
