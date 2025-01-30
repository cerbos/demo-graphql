// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import express from "express";
import "reflect-metadata";
import createContext from "./server/create-context";
import { createGQLServer } from "./server/graphql-server";
import logger from "./utils/logger";
import cors from "cors";
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from "@apollo/server/dist/esm/express4";

//ENABLE GLOBAL
const startTime = new Date();
const log = logger("demo-grapql");
log.info(`start ENV: ${process.env.NODE_ENV}`);
const port = process.env.PORT || 8000;

const app = express();

async function init() {
  const gqlServer = await createGQLServer();
  await gqlServer.start();

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
    });
  });

  app.use("/graphql", cors(), express.json(), expressMiddleware(gqlServer));

  app.listen(port);

  console.log(`Server is running
  STARTED: ${new Date()}
  ENV: ${process.env.NODE_ENV}
  PORT: ${port}`);
}

init().catch(console.error);
