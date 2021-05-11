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
    const cerbosResp = await this.cerbos.authoize({
      actions: ["view:approver"],
      resource: {
        kind: "expense:object",
        instances: {
          [expense.id]: {
            attr: {
              "id": expense.id,
              "region": expense.region.toString(),
              "status": expense.status.toString(),
              "ownerId": expense.createdBy.id,
            },
          },
        },
      },
      principal: context.user,
    });
    // Authorised so return the value
    return cerbosResp.isAuthorized(expense.id, "view:approver") ? expense.approvedBy : null;
  }
}

export default ExpensesResolver;
