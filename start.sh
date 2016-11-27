#!/bin/bash

node ./lib/main.js start --port ${PORT:-"3000"} --password ${ADMIN_PASS:-"default"} --mongo ${MONGO_URL:-"localhost/sbm"}
