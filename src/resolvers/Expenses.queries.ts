import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { AuthorizationError, CerbosService } from "../services/Cerbos.service";
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
  async expenses(): Promise<Expense[]> {
    return this.expensesService.list();
  }

  @Query((returns) => Expense)
  async expense(
    @Arg("id") id: string,
    @Ctx() context: IContext
  ): Promise<Expense> {
    // Get the expense by ID
    const expense = await this.expensesService.get(id);
    // This will authorize the user against cerbos or else through an authorization error
    const isAuthorized = await this.cerbos.authoize({
      action: "view",
      resource: {
        name: "expense:object",
        attr: {
          id,
          region: expense.region.toString(),
          status: expense.status.toString(),
          ownerId: expense.createdBy.id,
        },
      },
      principal: context.user,
    });
    if (!isAuthorized) throw new AuthorizationError("Access denied");
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
    // This will authorize the user against cerbos or else through an authorization error
    const isAuthorized = await this.cerbos.authoize({
      action: "approve",
      resource: {
        name: "expense:object",
        attr: {
          id,
          region: expense.region.toString(),
          status: expense.status.toString(),
          ownerId: expense.createdBy.id,
        },
      },
      principal: context.user,
    });
    if (!isAuthorized) throw new AuthorizationError("Access denied");
    // Do the actual approval call here....pretend it worked for now
    return true;
  }
}

export default ExpensesQueries;
