// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { Field, ID, ObjectType } from "type-graphql";
import { Region } from "../data/regions.data";

@ObjectType()
export default class Company {
  @Field((_type) => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  region!: Region;
}
