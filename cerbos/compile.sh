docker run -i -t \
-v $(pwd)/policies:/policies \
-v $(pwd)/tests:/tests \
ghcr.io/cerbos/cerbos:0.0.1-rc2 \
compile --tests=/tests /policies
