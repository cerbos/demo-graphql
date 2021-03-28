docker run -i -t -p 9999:9999 \
-v $(pwd)/policies:/policies \
-v $(pwd)/tests:/tests \
ghcr.io/cerbos/cerbos:0.0.0-alpha1 \
compile --tests=/tests /policies