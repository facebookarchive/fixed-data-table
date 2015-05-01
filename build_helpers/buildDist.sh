#!/bin/bash
set -e
PATH=$(npm bin):$PATH

rm -rf ./dist

NODE_ENV=production
webpack
COMPRESS=1 webpack
