#!/bin/sh
set -e
set -x
exec node_modules/.bin/cerbos run -- node dist/index.mjs
