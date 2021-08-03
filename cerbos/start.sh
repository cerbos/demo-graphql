#!/usr/bin/env bash

docker run -i -t -p 3592:3592 \
  -v $(pwd)/policies:/policies \
  ghcr.io/cerbos/cerbos:0.4.0
