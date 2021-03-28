import { Arg, Ctx, Query, Resolver } from "type-graphql";
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
  async invoice(@Arg('id') id: number, @Ctx() context: IContext): Promise<Invoice> {
    const invoice = await this.invoiceService.get(id);
    await this.cerbos.authoize({
      action: "invoice:get",
      resource: {
        name: "invoice:object",
        attr: {
          id: id + "",
          region: invoice.region.toString(),
          status: invoice.status.toString(),
        }
      },
      principal: {
        id: context.user.id + "",
        roles: [context.user.role.toString()]
      }
    })
    return invoice;
  }

}

export default InvoiceQueries;
