// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { expenseById, Expenses } from "../data/expenses.data";
import Expense from "../types/Expense.type";
import logger from "../utils/logger";

const log = logger("InvoiceService");

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
