FROM ghcr.io/cerbos/cerbos:0.0.0-alpha4 
COPY /policies /policies
COPY /config /config
ENTRYPOINT [ "/cerbos server --config=/config/conf.yaml" ]