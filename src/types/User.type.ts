import { Field, ObjectType } from "type-graphql";
import { Departments } from "../data/departments.data";
import { Region } from "../data/regions.data";
import { UserRole } from "../data/users.data";

@ObjectType()
export default class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  role: UserRole;

  @Field()
  department: Departments;

  @Field({ nullable: true })
  region?: Region;

  token: string;
}