// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ExpressContextFunctionArgument } from "@apollo/server/express4";
import DataLoader from "dataloader";
import Container from "typedi";
import { Users } from "../data/users.data";
import { CerbosService } from "../services/Cerbos.service";
import { CheckResourcesResult, ResourceCheck } from "@cerbos/core";
import logger from "../utils/logger";
import { IContext } from "./context.interface";
import { GraphQLError } from "graphql";
import { ContextFunction } from "@apollo/server";

const log = logger("createContext");

const createContext: ContextFunction<
  [ExpressContextFunctionArgument],
  IContext
> = async (request: ExpressContextFunctionArgument) => {
  // Create a new request container
  const requestId = Math.floor(
    Math.random() * Number.MAX_SAFE_INTEGER
  ).toString();
  const container = Container.of(requestId);
  const cerbosService = Container.get(CerbosService);

  // No token set access is denied
  if (!request.req.headers["token"])
    throw new GraphQLError("Access denied: No token provided");

  // DO SOME ACTUAL AUTHENTICATION AGAINST A DB etc
  const user = Users.find((u) => u.token === request.req.headers["token"]);

  // User not found so denied
  if (!user) throw new GraphQLError("Access denied: Token not valid");

  // Set the context in the container
  const context: IContext = {
    req: request.req,
    requestId,
    user,
    container: Container.of(requestId.toString()),
    loaders: {
      authorize: new DataLoader(async (resources: readonly ResourceCheck[]) => {
        const results = await cerbosService.cerbos.checkResources({
          principal: {
            id: user.id,
            roles: [user.role.toString()],
            attributes: JSON.parse(JSON.stringify(user)),
          },
          resources: resources as ResourceCheck[],
        });
        return resources.map(
          (key) =>
            results.findResult({
              kind: key.resource.kind,
              id: key.resource.id,
            }) as CheckResourcesResult
        );
      }),
    },
  };
  container.set("context", context);

  return context;
};

export default createContext;
