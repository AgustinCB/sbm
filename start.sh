#!/bin/bash

npm run build
node ./lib/main.js start --password ${ADMIN_PASS:-"default"} --mongo ${MONGO_URL:-"localhost/sbm"}
