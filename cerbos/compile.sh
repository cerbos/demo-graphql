#!/usr/bin/env bash

LATEST_VERSION=$(curl --silent "https://api.github.com/repos/cerbos/cerbos/releases/latest" | jq -r .tag_name)

docker run -i -t \
-v $(pwd)/policies:/policies \
ghcr.io/cerbos/cerbos:"${LATEST_VERSION:1}" \
compile /policies
