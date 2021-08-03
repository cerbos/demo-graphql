// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import DataLoader from "dataloader";
import {
  ICerbosBatchAuthorizeResource,
  ICerbosBatchAuthorizeResult,
} from "../services/Cerbos.service";
import User from "../types/User.type";

export interface IContext {
  req: ExpressContext["req"];
  requestId: string;
  user: User;
  loaders: {
    authorize: DataLoader<
      ICerbosBatchAuthorizeResource,
      ICerbosBatchAuthorizeResult,
      string
    >;
  };
}
