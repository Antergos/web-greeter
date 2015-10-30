themedir = /usr/share/lightdm-webkit
theme = antergos

EXTRA_DIST = $(theme)

dist-hook:
	chmod -R u+w $(distdir)/antergos
	rm -rf $(distdir)/antergos/.git

DISTCLEANFILES = \
	Makefile.in
