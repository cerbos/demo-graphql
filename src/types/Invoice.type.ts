import { Field, ObjectType } from "type-graphql";
import { InvoiceStatus } from "../data/invoices.data";
import { Region } from "../data/regions.data";
import Company from "./Company.type";
import User from "./User.type";

@ObjectType()
export default class Invoice {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => User)
  createdBy: User;

  @Field()
  amount: number;

  @Field()
  status: InvoiceStatus;

  @Field(() => Company)
  invoiceTo: Company

  @Field()
  region: Region;

  @Field(() => User, { nullable: true })
  approvedBy?: User;
}