// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { authZApolloPlugin } from "@graphql-authz/apollo-server-plugin";
import { ApolloServer } from "apollo-server-express";
import { config } from "node-config-ts";
import { buildSchema, registerEnumType, ResolverData } from "type-graphql";
import Container from "typedi";
import { Departments } from "../data/departments.data";
import { UserRole } from "../data/users.data";

import logger from "../utils/logger";
import { authZRules } from "./authz-rules";
import { IContext } from "./context.interface";

const log = logger("ApolloServer");

const registerEnums = () => {
  registerEnumType(UserRole, {
    name: "UserRole", // this one is mandatory
    description: "The role the user has", // this one is optional
  });

  registerEnumType(Departments, {
    name: "Departments", // this one is mandatory
    description: "Business departments", // this one is optional
  });
};

export async function createGQLServer(
  createContextFn: Function
): Promise<ApolloServer> {
  log.info("GraphQL schema building");
  try {
    registerEnums();
    const schema = await buildSchema({
      resolvers: [__dirname + "/../**/resolvers/*.{ts,js}"],
      container: ({ context }: ResolverData<IContext>) =>
        Container.of(context.requestId),
    });

    log.info("GraphQL schema built");

    const server = new ApolloServer({
      schema,
      introspection: config.graphql.introspection,
      context: createContextFn,
      logger: log,
      plugins: [
        authZApolloPlugin({ rules: authZRules }),
        {
          requestDidStart: () => Promise.resolve({
            async willSendResponse(requestContext) {
              log.debug(`dispose  ${requestContext.context.requestId}`);
              Container.reset(requestContext.context.requestId);
            },
          }),
        },

      ],
    });
    log.info("GraphQL server created");
    return server;
  } catch (e) {
    log.error("GraphQL server failed");
    console.error(e);
  }
}
