docker run -i -t \
-v $(pwd)/policies:/policies \
-v $(pwd)/tests:/tests \
ghcr.io/cerbos/cerbos:0.0.0-alpha5 \
compile --tests=/tests /policies
