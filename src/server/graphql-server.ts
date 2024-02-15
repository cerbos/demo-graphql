// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { config } from "node-config-ts";
import { buildSchema, registerEnumType, ResolverData } from "type-graphql";
import Container, { ContainerInstance } from "typedi";
import { Departments } from "../data/departments.data";
import { UserRole } from "../data/users.data";

import logger from "../utils/logger";
import { authChecker } from "./auth-checker";
import { IContext } from "./context.interface";
import ExpensesResolver from "../resolvers/Expense.resolver";
import ExpensesQueries from "../resolvers/Expenses.queries";
import { ApolloServer } from "@apollo/server";

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

export async function createGQLServer(): Promise<ApolloServer<IContext>> {
  log.info("GraphQL schema building");
  try {
    registerEnums();
    const schema = await buildSchema({
      resolvers: [ExpensesResolver, ExpensesQueries],
      container: ({ context }: ResolverData<IContext>) => context.container,
      authChecker: authChecker,
    });

    log.info("GraphQL schema built");

    const server = new ApolloServer<IContext>({
      schema,
      introspection: config.graphql.introspection,
      logger: log,
      plugins: [
        {
          requestDidStart: async () => ({
            async willSendResponse(requestContext) {
              // Dispose the scoped container to prevent memory leaks
              Container.reset(requestContext.contextValue.requestId.toString());

              // For developers curiosity purpose, here is the logging of current scoped container instances
              // Make multiple parallel requests to see in console how this works
              const instancesIds = ((Container as any)
                .instances as ContainerInstance[]).map(
                (instance) => instance.id
              );
              console.log("Instances left in memory: ", instancesIds);
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
