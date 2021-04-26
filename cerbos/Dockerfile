FROM ghcr.io/cerbos/cerbos:0.0.0-alpha6 
LABEL org.opencontainers.image.source https://github.com/cerbos/demo-graphql
COPY /policies /policies
COPY /config /config
ENTRYPOINT [ "/cerbos", "server", "--config=/config/conf.yaml" ]
