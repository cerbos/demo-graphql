import { Service } from "typedi";
import { expenseById, Expenses } from "../data/expenses.data";
import Expense from "../types/Expense.type";
import logger from "../utils/logger";

const log = logger("InvoiceService");

@Service({ global: true })
export class ExpensesService {
  constructor() {
    log.info("created");
  }

  async list(): Promise<Expense[]> {
    return Expenses;
  }

  async get(id: string): Promise<Expense> {
    return expenseById(id);
  }
}
