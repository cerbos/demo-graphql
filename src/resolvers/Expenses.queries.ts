// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ApolloError } from "apollo-server-errors";
import { Arg, Ctx, Mutation, Query } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";

import { ExpensesService } from "../services/Expenses.service";
import Expense from "../types/Expense.type";

import logger from "../utils/logger";
import { AuthZ } from "../server/authz-rules";

const log = logger("ExpensesQueries");

@Service()
class ExpensesQueries {
  @Inject(() => ExpensesService)
  private expensesService: ExpensesService;

  constructor() {
    log.info("created");
  }

  @Query((returns) => [Expense])
  async expenses(@Ctx() context: IContext): Promise<Expense[]> {
    const expenses = await this.expensesService.list();
    return expenses
  }

  @Query((returns) => Expense)
  async expense(
    @Arg("id") id: string,
    @Ctx() context: IContext
  ): Promise<Expense> {
    // Get the expense by ID
    const expense = await this.expensesService.get(id);
    if (!expense) throw new ApolloError("Expense not found");
    //Return the invoice
    return expense;
  }

  @Mutation((returns) => Boolean)
  @AuthZ({ rules: ['CanApproveExpense'] })
  async approveExpense(
    @Arg("id") id: string,
    @Ctx() context: IContext
  ): Promise<boolean> {
    // Get the invoice by ID
    const expense = await this.expensesService.get(id);
    if (!expense) throw new ApolloError("Expense not found");

    // do the actual approve here
    return true;
  }
}

export default ExpensesQueries;
