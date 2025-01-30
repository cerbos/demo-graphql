// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { GRPC as Cerbos } from "@cerbos/grpc";
import { GraphQLError } from "graphql";

export class AuthorizationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        type: "AUTHORIZATION_ERROR",
      },
    });
    Object.defineProperty(this, "name", { value: "AuthorizationError" });
  }
}

export class CerbosService {
  public cerbos: Cerbos;
  constructor() {
    this.cerbos = new Cerbos(process.env.CERBOS_GRPC || "localhost:3593", {
      tls: false,
    });
  }
}
