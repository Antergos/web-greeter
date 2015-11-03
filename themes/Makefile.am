themedir = $(THEME_DIR)/antergos
theme_DATA = antergos

EXTRA_DIST = $(theme)

install-data-hook:
	chmod -R u+w $(distdir)/themes/antergos
	rm -rf $(distdir)/themes/antergos/.git

DISTCLEANFILES = \
	Makefile.in
