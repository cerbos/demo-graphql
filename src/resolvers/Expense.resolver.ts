// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { IContext } from "../server/context.interface";
import Expense from "../types/Expense.type";
import User from "../types/User.type";

import logger from "../utils/logger";
import { AuthZ } from "../server/authz-rules";

const log = logger("ExpensesResolver");

@Service()
@Resolver((of) => Expense)
class ExpensesResolver implements ResolverInterface<Expense> {
  @FieldResolver()
  async approvedBy(
    @Root() expense: Expense,
    @Ctx() context: IContext
  ): Promise<User> {
    return expense.approvedBy
  }
}

export default ExpensesResolver;
