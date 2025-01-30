FROM node:22-slim AS base

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY entrypoint.sh .
COPY src src
COPY schema.graphql schema.graphql
RUN npm ci --prefer-offline --no-audit --ignore-engines
RUN npm run build
RUN npm prune --omit=dev --no-audit --ignore-engines

FROM node:22-slim AS final
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/node_modules node_modules
COPY --from=base /usr/src/app/dist dist
COPY --from=base /usr/src/app/entrypoint.sh .
COPY --from=base /usr/src/app/package.json package.json
COPY --from=base /usr/src/app/schema.graphql schema.graphql

RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
