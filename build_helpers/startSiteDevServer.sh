#!/bin/bash
set -e
PATH=$(npm bin):$PATH

rm -rf ./__site__
rm -rf ./__site_prerender__
./build_helpers/buildAPIDocs.sh
webpack --config "$PWD/site/webpack-prerender.config.js"
./build_helpers/buildSiteIndexPages.sh
webpack-dev-server --host 0.0.0.0 --config "$PWD/site/webpack-client.config.js" --no-info --content-base __site__
