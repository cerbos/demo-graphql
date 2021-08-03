// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { Field, ObjectType } from "type-graphql";
import { ExpenseStatus } from "../data/expenses.data";

import { Region } from "../data/regions.data";
import Company from "./Company.type";
import User from "./User.type";

@ObjectType()
export default class Expense {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => User)
  createdBy: User;

  @Field()
  amount: number;

  @Field()
  status: ExpenseStatus;

  @Field(() => Company)
  vendor: Company

  @Field()
  region: Region;

  @Field(() => User, { nullable: true })
  approvedBy?: User;
}
