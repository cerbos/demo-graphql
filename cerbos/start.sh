#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

docker run -i -t -p 3592:3592 -p 3593:3593 \
  -v "${SCRIPT_DIR}/policies:/policies" \
  ghcr.io/cerbos/cerbos:latest
