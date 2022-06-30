// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ApolloError } from "apollo-server-errors";
import { config } from "node-config-ts";
import { Service } from "typedi";

import { GRPC as Cerbos } from "@cerbos/grpc";
import logger from "../utils/logger";

const log = logger("CerbosService");

export class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, "AUTHORIZATION_ERROR");
    Object.defineProperty(this, "name", { value: "AuthorizationError" });
  }
}



@Service({ global: true })
export class CerbosService {
  public cerbos: Cerbos;
  constructor() {
    this.cerbos = new Cerbos(config.cerbos.host, { tls: config.cerbos.tls });
  }
}
