FROM ubuntu:16.10
MAINTAINER Antergos Developers <dev@antergos.com>

RUN DEBIAN_FRONTEND=noninteractive apt-get update; \
	apt-get install -y \
		libgtk-3-dev \
		liblightdm-gobject-1-dev \
		libdbus-glib-1-dev \
		libwebkit2gtk-4.0-dev \
		ninja-build \
		python3-pip; pip3 install meson

VOLUME /build
WORKDIR /build
