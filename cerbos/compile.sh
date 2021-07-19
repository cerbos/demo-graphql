#!/usr/bin/env bash

docker run -i -t \
-v $(pwd)/policies:/policies \
pkg.cerbos.dev/containers/cerbos:0.3.0 \
compile /policies
