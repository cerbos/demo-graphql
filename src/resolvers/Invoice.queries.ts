import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { IContext } from "../server/context.interface";
import { CerbosService } from "../services/Cerbos.service";
import { InvoiceService } from "../services/Invoice.service";
import Invoice from "../types/Invoice.type";
import logger from "../utils/logger";

const log = logger('InvoiceQueries');


@Service()
class InvoiceQueries {
  @Inject(() => CerbosService)
  private cerbos: CerbosService

  @Inject(() => InvoiceService)
  private invoiceService: InvoiceService

  constructor() {
    log.info("created")
  }

  @Query(returns => [Invoice])
  async invoices(): Promise<Invoice[]> {
    return this.invoiceService.list();
  }

  @Query(returns => Invoice)
  async invoice(@Arg('id') id: string, @Ctx() context: IContext): Promise<Invoice> {
    // Get the invoice by ID
    const invoice = await this.invoiceService.get(id);
    // This will authorize the user against cerbos or else through an authorization error
    await this.cerbos.authoize({
      action: "view",
      resource: {
        name: "invoice:object",
        attr: {
          id,
          region: invoice.region.toString(),
          status: invoice.status.toString(),
          ownerId: invoice.createdBy.id
        }
      },
      principal: context.user
    })
    // Return the invoice
    return invoice;
  }

  @Mutation(returns => Boolean)
  async approveInvoice(@Arg('id') id: string, @Ctx() context: IContext): Promise<boolean> {
    // Get the invoice by ID
    const invoice = await this.invoiceService.get(id);
    // This will authorize the user against cerbos or else through an authorization error
    await this.cerbos.authoize({
      action: "approve",
      resource: {
        name: "invoice:object",
        attr: {
          id,
          region: invoice.region.toString(),
          status: invoice.status.toString(),
          ownerId: invoice.createdBy.id
        }
      },
      principal: context.user
    })
    // Do the actual approval call here....pretend it worked for now
    return true;
  }

}

export default InvoiceQueries;
