#!/usr/bin/env bash

docker run -i -t \
-v $(pwd)/policies:/policies \
ghcr.io/cerbos/cerbos:0.4.0 \
compile /policies
