import { Field, ObjectType } from "type-graphql";
import { Region } from "../data/regions.data";

@ObjectType()
export default class Company {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  region: Region;
}