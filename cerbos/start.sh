docker run -i -t -p 9999:9999 \
  -v $(pwd)/config:/config \
  -v $(pwd)/policies:/policies \
  ghcr.io/cerbos/cerbos:0.0.1-rc2 \
  server --config=/config/conf.yaml
