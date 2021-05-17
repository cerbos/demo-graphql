docker run -i -t -p 9999:9999 \
  -v $(pwd)/config:/config \
  -v $(pwd)/policies:/policies \
  pkg.cerbos.dev/containers/cerbos:0.0.1-rc2 \
  server --config=/config/conf.yaml
