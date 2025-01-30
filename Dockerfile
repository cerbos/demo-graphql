# Use a specific version of node for reproducibility
FROM node:22-slim AS base

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit --ignore-engines

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev --no-audit --ignore-engines

# Final stage
FROM node:22-slim AS final
LABEL org.opencontainers.image.source="https://github.com/cerbos/demo-graphql"

WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=base /usr/src/app/node_modules node_modules
COPY --from=base /usr/src/app/dist dist
COPY --from=base /usr/src/app/entrypoint.sh .
COPY --from=base /usr/src/app/package.json package.json
COPY --from=base /usr/src/app/schema.graphql schema.graphql
COPY --from=base /usr/src/app/policies policies

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
