// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import express from "express";
import { config } from "node-config-ts";
import "reflect-metadata";
import createContext from "./server/create-context";
import { createGQLServer } from "./server/graphql-server";
import logger from "./utils/logger";
import cors from "cors";
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from "@apollo/server/express4";

//ENABLE GLOBAL
const startTime = new Date();
const log = logger("demo-grapql");
log.info(`start ENV: ${process.env.NODE_ENV}`);
const port = config.port || 8000;

const app = express();

async function init() {
  const createContextFn = (request: ExpressContextFunctionArgument) =>
    createContext(request);
  const gqlServer = await createGQLServer();

  app.get("/", (_, res) => {
    res.send("demo-server");
  });

  app.get("/status", async (_, res) => {
    res.json({
      port: port,
      env: process.env.NODE_ENV,
      startedAt: startTime,
      node: process.env.NODE_NAME,
      pod: process.env.POD_NAME,
      config,
    });
  });

  await gqlServer.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(gqlServer, {
      context: createContextFn,
    })
  );

  app.listen(port);

  console.log(`Server is running
  STARTED: ${new Date()}
  ENV: ${process.env.NODE_ENV}
  PORT: ${port}`);
}

init().catch(console.error);
