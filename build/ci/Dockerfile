FROM ubuntu:16.04
MAINTAINER Antergos Developers <dev@antergos.com>

RUN DEBIAN_FRONTEND=noninteractive apt-get update; \
	apt-get install -y \
		libgtk-3-dev \
		liblightdm-gobject-1-dev \
		libexo-1-dev \
		exo-utils \
		libdbus-glib-1-dev \
		gnome-common \
		libwebkit2gtk-4.0-dev

VOLUME /build
WORKDIR /build
