#!/bin/make -f

DO=./build/utils.sh
SET_CONFIG=$(DO) set-config

define colorecho
	@tput setaf 118
	@echo $1
	@tput sgr0
endef


all: install

apply_config:
	@#            | KEY                 | VALUE FROM COMMAND LINE  | DEFAULT VALUE
	@$(SET_CONFIG) background_images_dir '$(background_images_dir)' /usr/share/backgrounds
	@$(SET_CONFIG) config_dir            '$(config_dir)'            /etc/lightdm
	@$(SET_CONFIG) greeters_dir          '$(greeters_dir)'          /usr/share/xgreeters
	@$(SET_CONFIG) locale_dir            '$(locale_dir)'            /usr/share/locale
	@$(SET_CONFIG) themes_dir            '$(themes_dir)'            /usr/share/web-greeter

build_init: clean
	$(DO) build-init

build: build_init apply_config
	$(DO) build

clean:
	$(DO) clean

install: build
	$(DO) install $(DESTDIR)
	$(call colorecho, SUCCESS!)

