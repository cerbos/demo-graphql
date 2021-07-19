// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import Expense from "../types/Expense.type";
import { companyById } from "./companies.data";
import { Region } from "./regions.data";
import { userById } from "./users.data";

export enum ExpenseStatus {
  OPEN = "OPEN",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const Expenses: Expense[] = [
  {
    id: "expense1",
    createdAt: new Date("2021-10-01"),
    createdBy: userById("user3"),
    vendor: companyById("company2"),
    region: Region.EMEA,
    amount: 2421.12,
    status: ExpenseStatus.OPEN,
  },
  {
    id: "expense2",
    createdAt: new Date("2021-10-01"),
    createdBy: userById("user3"),
    vendor: companyById("company3"),
    region: Region.EMEA,
    amount: 513.5,
    status: ExpenseStatus.APPROVED,
    approvedBy: userById("user2"),
  },
];

export const expenseById = (id: string): Expense => {
  return Expenses.find((c) => c.id === id);
};
