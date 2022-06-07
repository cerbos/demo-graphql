#!/usr/bin/env bash

docker run -i -t \
-v $(pwd)/policies:/policies \
ghcr.io/cerbos/cerbos:latest \
compile /policies
