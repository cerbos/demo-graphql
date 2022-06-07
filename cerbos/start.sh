#!/usr/bin/env bash

docker run -i -t -p 3592:3592 -p 3593:3593 \
  -v $(pwd)/policies:/policies \
  ghcr.io/cerbos/cerbos:latest
