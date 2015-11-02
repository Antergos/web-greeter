cmake_minimum_required(VERSION 2.8)
project(lightdm-webkit2-greeter C)

#[[
set(lightdm-webkit2-greeter_VERSION_MAJOR 0)
set(lightdm-webkit2-greeter_VERSION_MINOR 2)
set(lightdm-webkit2-greeter_VERSION_BUGFIX 3)

set(PROJECT_SOURCE_DIR src)
set(LIBSRC ${PROJECT_SOURCE_DIR})
set(SRC lightdm-webkit2-greeter)

install(FILES lightdm-webkit2-greeter-ext.so DESTINATION lib)
install(FILES lightdm-webkit2-greeter DESTINATION bin)

add_library(lightdm-webkit2-greeter-ext SHARED ${LIBSRC}/lightdm-webkit2-greeter-ext.c)
add_executable(lightdm-webkit2-greeter ${PROJECT_SOURCE_DIR}/lightdm-webkit2-greeter.c)]]
