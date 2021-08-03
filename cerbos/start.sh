#!/usr/bin/env bash

docker run -i -t -p 3592:3592 \
  -v $(pwd)/policies:/policies \
  pkg.cerbos.dev/containers/cerbos:0.4.0
