FROM node:18-slim AS base

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY entrypoint.sh .
COPY config config
COPY src src
RUN npm ci --prefer-offline --no-audit --ignore-engines
RUN npm run build
RUN npm prune --production --no-audit --ignore-engines

FROM node:18-slim AS final
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/node_modules node_modules
COPY --from=base /usr/src/app/build build
COPY --from=base /usr/src/app/config config
COPY --from=base /usr/src/app/entrypoint.sh .
COPY --from=base /usr/src/app/package.json package.json

RUN chmod +x entrypoint.sh
ENTRYPOINT ./entrypoint.sh