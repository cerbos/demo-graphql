// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { ApolloError } from "apollo-server-errors";
import axios from "axios";
import { config } from "node-config-ts";
import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

const log = logger("CerbosService");

interface IPrincipal {
  id: string;
  policyVersion?: any;
  roles: [string];
  attr: {
    [key: string]: any;
  };
}

interface IAuthorize {
  actions: [string];
  resource: {
    policyVersion?: any;
    kind: string;
    instances: {
      [resourceKey: string]: {
        attr: {
          [key: string]: any;
        };
      };
    };
  };
  principal: IPrincipal;
}

interface IAuthorizeResponse {
  requestID: string;
  resourceInstances: {
    [resourceKey: string]: {
      actions: {
        [key: string]: AuthorizeEffect;
      };
    };
  };
}

export interface ICerbosBatchAuthorizeResource {
  actions: [string];
  resource: {
    policyVersion?: any;
    kind: string;
    id: string;
    attr: {
      [key: string]: any;
    };
  };
}

export interface ICerbosBatchAuthorizeResult {
  [key: string]: AuthorizeEffect;
}

interface IBatchAuthorize {
  principal: IPrincipal;
  resources: ICerbosBatchAuthorizeResource[];
}

interface IAuthorizeBatchResponse {
  requestID: string;
  results: {
    resourceId: string;
    actions: ICerbosBatchAuthorizeResult;
  }[];
}

export enum AuthorizeEffect {
  ALLOW = "EFFECT_ALLOW",
  DENY = "EFFECT_DENY",
}

export interface ICerbosResponse {
  isAuthorized: (resourceKey: string, action: string) => boolean;
}

class CerbosResponseWrapper implements ICerbosResponse {
  readonly resp: IAuthorizeResponse;

  constructor(resp: IAuthorizeResponse) {
    this.resp = resp;
  }

  isAuthorized(resourceKey: string, action: string): boolean {
    let allowed =
      this.resp.resourceInstances[resourceKey]?.actions[action] ==
      AuthorizeEffect.ALLOW;
    return allowed ?? false;
  }
}

interface ICerbosBatchResponse {
  resourceId: string;
  actions: {
    [action: string]: AuthorizeEffect;
  };
}

export class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, "AUTHORIZATION_ERROR");
    Object.defineProperty(this, "name", { value: "AuthorizationError" });
  }
}

@Service({ global: true })
export class CerbosService {
  constructor() {}

  async authorize(data: IAuthorize): Promise<ICerbosResponse> {
    log.info(
      `authorize action: ${data.actions} principalId: ${data.principal.id}`
    );
    const payload = {
      requestId: uuidv4(),
      ...data,
      resource: {
        policyVersion: data.resource.policyVersion || "default",
        ...data.resource,
      },
      principal: {
        policyVersion: data.principal.policyVersion || "default",
        ...data.principal,
      },
    };

    // log.info(JSON.stringify(payload,null,2));

    try {
      const response = await axios.post<IAuthorizeResponse>(
        `${config.cerbos.host}/api/check`,
        payload
      );
      // log.info(JSON.stringify(response.data,null,2));
      return new CerbosResponseWrapper(response.data);
    } catch (e) {
      throw new AuthorizationError("Error authorizing");
    }
  }

  async authorizeBatch(data: IBatchAuthorize): Promise<ICerbosBatchResponse[]> {
    log.info(
      `authorizeBatch action: principalId: ${data.principal.id} batchSize: ${data.resources.length}`
    );
    const payload = {
      requestId: uuidv4(),
      principal: {
        policyVersion: data.principal.policyVersion || "default",
        ...data.principal,
      },
      resources: data.resources.map((r) => {
        return {
          actions: r.actions,
          resource: {
            policyVersion: r.resource.policyVersion || "default",
            ...r.resource,
          },
        };
      }),
    };

    try {
      const response = await axios.post<IAuthorizeBatchResponse>(
        `${config.cerbos.host}/api/check_resource_batch`,
        payload
      );
      // Return the results in the same order of the inputs
      console.log(response.data.results);
      return response.data.results;
    } catch (e) {
      throw new AuthorizationError("Error authorizing");
    }
  }
}
