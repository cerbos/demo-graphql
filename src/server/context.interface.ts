// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ExpressContextFunctionArgument } from "@apollo/server/express4";
import DataLoader from "dataloader";
import { ResourceCheck, CheckResourcesResult } from "@cerbos/core";
import User from "../types/User.type";
import { ContainerInstance } from "typedi";

export interface IContext {
  req: ExpressContextFunctionArgument["req"];
  requestId: string;
  container: ContainerInstance;
  user: User;
  loaders: {
    authorize: DataLoader<ResourceCheck, CheckResourcesResult, string>;
  };
}
