// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { buildSchema, registerEnumType } from "type-graphql";
import { UserRole } from "../data/users.data";
import logger from "../utils/logger";
import { authChecker } from "./auth-checker";
import { IContext } from "./context.interface";
import ExpensesResolver from "../resolvers/Expense.resolver";
import ExpensesQueries from "../resolvers/Expenses.queries";
import { ApolloServer } from "@apollo/server";
import { Departments } from "../data/departments.data.js";

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
      authChecker: authChecker,
    });

    log.info("GraphQL schema built");

    const server = new ApolloServer<IContext>({
      schema,
      introspection: process.env.GRAPHQL_INTROSPECTION === "true",
      logger: log,
    });

    log.info("GraphQL server created");
    return server;
  } catch (e) {
    log.error("GraphQL server failed");
    throw e;
  }
}
