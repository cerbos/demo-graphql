// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { Expense, ExpenseStatus, Region } from "../generated/graphql";
import { companyById } from "./companies.data";
import { userById } from "./users.data";

export const Expenses: Expense[] = [
  {
    id: "expense1",
    createdAt: new Date("2021-10-01"),
    createdBy: userById("user3"),
    vendor: companyById("company2"),
    region: Region.Emea,
    amount: 2421.12,
    status: ExpenseStatus.Open,
  },
  {
    id: "expense2",
    createdAt: new Date("2021-10-01"),
    createdBy: userById("user3"),
    vendor: companyById("company3"),
    region: Region.Emea,
    amount: 513.5,
    status: ExpenseStatus.Approved,
    approvedBy: userById("user2"),
  },
];

export const expenseById = (id: string): Expense => {
  return Expenses.find((c) => c.id === id);
};
