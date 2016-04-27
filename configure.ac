dnl Process this file with autoconf to produce a configure script.

AC_INIT(lightdm-webkit2-greeter, 2.1.4)
AC_SUBST(THEME_DIR)
AC_CONFIG_HEADER(config.h)
AC_PREREQ([2.59])

LT_INIT()

AM_INIT_AUTOMAKE
AM_PROG_CC_C_O
AM_MAINTAINER_MODE
m4_ifdef([AM_SILENT_RULES], [AM_SILENT_RULES(yes)])

GNOME_COMPILE_WARNINGS(maximum)

dnl ###########################################################################
dnl Dependencies
dnl ###########################################################################

PKG_CHECK_MODULES([GREETER], [
    liblightdm-gobject-1
    gtk+-3.0
    webkit2gtk-4.0
    dbus-glib-1
    x11
])

PKG_CHECK_MODULES([WEB_EXTENSION], [
    webkit2gtk-web-extension-4.0 >= 2.10.8
])

PKG_CHECK_MODULES([GREETER], [gtk+-3.0 >= 3.20],
   [AC_DEFINE([HAVE_GTK320], [1], [Use Gtk320])],
       [AC_DEFINE([HAVE_GTK320], [0], [Use Gtk320])]
)
AM_CONDITIONAL([HAVE_GTK320], [test "$HAVE_GTK320" -eq 1])

AC_SUBST([WEB_EXTENSION_CFLAGS])
AC_SUBST([WEB_EXTENSION_LIBS])

# Check for exo-csource
AC_DEFUN([AC_PROG_EXOCSOURCE], [AC_CHECK_PROG(EXOCSOURCE,exo-csource,yes)])
AC_PROG_EXOCSOURCE
if test x"${EXOCSOURCE}" != x"yes" ; then
    AC_MSG_ERROR([Please install the package containing the exo-csource binary.])
fi

dnl ###########################################################################
dnl Configurable values
dnl ###########################################################################

THEME_DIR="/usr/share/lightdm-webkit/themes"
AC_ARG_WITH(theme-dir,
            AS_HELP_STRING(--with-theme-dir=<path>,
                           Theme directory to use for webkit themes),
    if test x$withval != x; then
        THEME_DIR="$withval"
    fi
)
AC_SUBST(THEME_DIR)
AC_DEFINE_UNQUOTED(THEME_DIR, "$THEME_DIR", Theme Dir)

dnl ###########################################################################
dnl ###########################################################################

CONFIG_DIR="/etc/lightdm/"
AC_ARG_WITH(config-dir,
            AS_HELP_STRING(--with-config-dir=<path>,
                           Configuration directory of lightdm),
    if test x$withval != x; then
        CONFIG_DIR="$withval"
    fi
)
AC_SUBST(CONFIG_DIR)
AC_DEFINE_UNQUOTED(CONFIG_DIR, "$CONFIG_DIR", Config Dir)

dnl ###########################################################################
dnl ###########################################################################

DESKTOP_DIR="/usr/share/xgreeters/"
AC_ARG_WITH(desktop-dir,
            AS_HELP_STRING(--with-desktop-dir=<path>,
                           Desktop directory of lightdm),
    if test x$withval != x; then
        DESKTOP_DIR="$withval"
    fi
)
AC_SUBST(DESKTOP_DIR)
AC_DEFINE_UNQUOTED(DESKTOP_DIR, "$DESKTOP_DIR", Desktop Dir)

dnl ###########################################################################
dnl ###########################################################################

AC_ARG_ENABLE([at-spi-command],
    AC_HELP_STRING([--enable-at-spi-command[=command]], [Try to start at-spi service]])
    AC_HELP_STRING([--disable-at-spi-command], [Do not start at-spi service]),
    [], [])

AS_IF([test "x$enable_at_spi_command" != "xno"],
[
    if test "x$enable_at_spi_command" = "xyes" || test "x$enable_at_spi_command" = "x"; then
        enable_at_spi_command="/usr/lib/at-spi2-core/at-spi-bus-launcher --launch-immediately"
    fi
    AC_DEFINE_UNQUOTED([AT_SPI_COMMAND], ["$enable_at_spi_command"], [Command to start at-spi service])
])

dnl ###########################################################################
dnl Internationalization
dnl ###########################################################################

IT_PROG_INTLTOOL(0.35.0)
GETTEXT_PACKAGE=lightdm-webkit2-greeter
AC_DEFINE_UNQUOTED(GETTEXT_PACKAGE, "$GETTEXT_PACKAGE", Gettext package)

dnl ###########################################################################
dnl Files to generate
dnl ###########################################################################

AC_OUTPUT([
Makefile
data/Makefile
man/Makefile
src/Makefile
po/Makefile.in
themes/Makefile
themes/_vendor/Makefile
themes/_vendor/css/Makefile
themes/_vendor/fonts/Makefile
themes/_vendor/fonts/font-awesome/Makefile
themes/_vendor/fonts/TTF/Makefile
themes/_vendor/js/Makefile
themes/antergos/Makefile
themes/antergos/css/Makefile
themes/antergos/js/Makefile
themes/antergos/img/Makefile
themes/simple/Makefile
])

dnl ###########################################################################
dnl Summary
dnl ###########################################################################

echo "
                    Light Display Manager WebKit2 Greeter $VERSION
                    ==========================================

        prefix:                   $prefix
        Theme directory:          $THEME_DIR
        Configuration directory:  $CONFIG_DIR
"
