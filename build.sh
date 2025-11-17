#!/usr/bin/env bash

mkdir -p ./dist
zip -r -FS ./dist/pixiv-hide-works.xpi ./* --exclude ./README.md ./.gitignore ./build.sh ./dist/
