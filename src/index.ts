// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ExpressContext } from "apollo-server-express";
import express from "express";
import { config } from "node-config-ts";
import "reflect-metadata";
import createContext from "./server/create-context";
import { createGQLServer } from "./server/graphql-server";
import logger from "./utils/logger";

//ENABLE GLOBAL
const startTime = new Date();
const log = logger("demo-grapql");
log.info(`start ENV: ${process.env.NODE_ENV}`);
const port = config.port || 8000;

async function init() {
  const createContextFn = (request: ExpressContext) => createContext(request);
  const gqlServer = await createGQLServer(createContextFn);
  const app = express();

  app.get("/", (req, res) => {
    res.send("demo-server");
  });

  app.get("/status", async (_, res) => {
    const meta = {
      port: port,
      env: process.env.NODE_ENV,
      startedAt: startTime,
      node: process.env.NODE_NAME,
      pod: process.env.POD_NAME,
    };
    res.json(meta);
  });

  //Apply the GQL Server
  gqlServer.applyMiddleware({ app, path: "/graphql" });

  // Start the server
  app.listen(port, () => log.info(`Listening on port ${port}`));
  console.log(`Server is running
  STARTED: ${new Date()}
  ENV: ${process.env.NODE_ENV}
  PORT: ${port}`);
}

init().catch(console.error);
