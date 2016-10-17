cmake_minimum_required(VERSION 3.6)
project(lightdm_webkit2_greeter C)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

if(EXISTS "src/gresource")
	set(SOURCE_FILES
		src/gresource/greeter-resources.c
		src/gresource/greeter-resources.h
		src/config.h
		src/greeter.c
		src/webkit2-extension.c)
else()
	set(SOURCE_FILES
			src/lightdm-webkit2-greeter.c
			src/lightdm-webkit2-greeter-ext.c)
endif()

include_directories(
		/usr/include/gtk-3.0
		/usr/include/glib-2.0
		/usr/include/glib-2.0/glib
		/usr/include/webkitgtk-4.0
		/usr/include/lightdm-gobject-1)

add_executable(lightdm_webkit2_greeter ${SOURCE_FILES})
