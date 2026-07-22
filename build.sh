#!/usr/bin/env bash
set -e
mkdir -p dist
npx --yes html-minifier-terser@7 \
  --collapse-whitespace --remove-comments --remove-redundant-attributes \
  --use-short-doctype --minify-css true --minify-js true \
  -o dist/index.html index.html
npx --yes clean-css-cli@5 -o dist/style.css style.css
npx --yes terser@5 script.js -c -m -o dist/script.js
cp -r photos dist/photos
cp -r audio dist/audio
