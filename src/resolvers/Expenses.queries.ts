// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ApolloError } from "apollo-server-errors";
import { Arg, Ctx, Mutation, Query } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import {
  AuthorizationError,
  CerbosService,
} from "../services/Cerbos.service";
import { Effect, CheckResourcesResult } from "@cerbos/core";
import { ExpensesService } from "../services/Expenses.service";
import Expense from "../types/Expense.type";

import logger from "../utils/logger";

const log = logger("ExpensesQueries");

@Service()
class ExpensesQueries {
  @Inject(() => CerbosService)
  private cerbos: CerbosService;

  @Inject(() => ExpensesService)
  private expensesService: ExpensesService;

  constructor() {
    log.info("created");
  }

  @Query((returns) => [Expense])
  async expenses(@Ctx() context: IContext): Promise<Expense[]> {
    const expenses = await this.expensesService.list();
    const action = "view";

    const authorized = await context.loaders.authorize.loadMany(
      expenses.map((expense) => {
        return {
          actions: [action],
          resource: {
            id: expense.id,
            kind: "expense:object",
            attributes: {
              id: expense.id,
              region: expense.region.toString(),
              status: expense.status.toString(),
              ownerId: expense.createdBy.id,
            },
          },
        };
      })
    );



    return expenses.filter(
      (_, i) => (authorized[i] as CheckResourcesResult).actions[action] === Effect.ALLOW
    );
  }

  @Query((returns) => Expense)
  async expense(
    @Arg("id") id: string,
    @Ctx() context: IContext
  ): Promise<Expense> {
    // Get the expense by ID
    const expense = await this.expensesService.get(id);
    if (!expense) throw new ApolloError("Expense not found");
    // This will authorize the user against cerbos or else through an authorization error

    const authorized = await context.loaders.authorize.load({
      actions: ["view"],
      resource: {
        id: expense.id,
        kind: "expense:object",
        attributes: {
          id: expense.id,
          region: expense.region.toString(),
          status: expense.status.toString(),
          ownerId: expense.createdBy.id,
        },
      },
    });
    console.log(authorized)
    if (authorized.actions["view"] !== Effect.ALLOW)
      throw new AuthorizationError("Access denied");
    // Return the invoice
    return expense;
  }

  @Mutation((returns) => Boolean)
  async approveExpense(
    @Arg("id") id: string,
    @Ctx() context: IContext
  ): Promise<boolean> {
    // Get the invoice by ID
    const expense = await this.expensesService.get(id);
    if (!expense) throw new ApolloError("Expense not found");
    // This will authorize the user against cerbos or else through an authorization error

    const authorized = await context.loaders.authorize.load({
      actions: ["approve"],
      resource: {
        id: expense.id,
        kind: "expense:object",
        attributes: {
          id: expense.id,
          region: expense.region.toString(),
          status: expense.status.toString(),
          ownerId: expense.createdBy.id,
        },
      },
    });

    if (authorized.actions["approve"] !== Effect.ALLOW)
      throw new AuthorizationError("Access denied");

    return true;
  }
}

export default ExpensesQueries;
