FROM pkg.cerbos.dev/containers/cerbos:0.0.1-rc2
LABEL org.opencontainers.image.source https://github.com/cerbos/demo-graphql
COPY /policies /policies
COPY /config /config
ENTRYPOINT [ "/cerbos", "server", "--config=/config/conf.yaml" ]
