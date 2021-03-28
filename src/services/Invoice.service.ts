import { Service } from "typedi";
import { invoiceById, Invoices } from "../data/invoices.data";
import Invoice from "../types/Invoice.type";
import logger from "../utils/logger";

const log = logger('InvoiceService');

@Service({ global: true })
export class InvoiceService {
  constructor() {
    log.info("created");
  }

  async list(): Promise<Invoice[]> {
    return Invoices;
  }


  async get(id: number): Promise<Invoice> {
    return invoiceById(id);
  }

}
