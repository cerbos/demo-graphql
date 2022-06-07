// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import {
  Ctx,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { CerbosService } from "../services/Cerbos.service";
import { Effect } from "@cerbos/core";
import Expense from "../types/Expense.type";
import User from "../types/User.type";

import logger from "../utils/logger";

const log = logger("ExpensesResolver");

@Service()
@Resolver((of) => Expense)
class ExpensesResolver implements ResolverInterface<Expense> {
  @Inject(() => CerbosService)
  private cerbos: CerbosService;

  @FieldResolver()
  async approvedBy(
    @Root() expense: Expense,
    @Ctx() context: IContext
  ): Promise<User> {
    // see if the user is allowed to see who approved it
    const authorized = await context.loaders.authorize.load({
      actions: ["view:approver"],
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
    return authorized["view:approver"] === Effect.ALLOW
      ? expense.approvedBy
      : null;
  }
}

export default ExpensesResolver;
