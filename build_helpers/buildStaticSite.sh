#!/bin/bash
set -e
PATH=$(npm bin):$PATH

rm -rf ./__site__
rm -rf ./__site_prerender__
./build_helpers/buildAPIDocs.sh
NODE_ENV=production webpack --config "$PWD/site/webpack-client.config.js"
NODE_ENV=production webpack --config "$PWD/site/webpack-prerender.config.js"
NODE_ENV=production ./build_helpers/buildSiteIndexPages.sh
