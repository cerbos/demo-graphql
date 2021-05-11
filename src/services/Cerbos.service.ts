import { ApolloError } from "apollo-server-errors";
import axios from "axios";
import { config } from "node-config-ts";
import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import User from "../types/User.type";
import logger from "../utils/logger";

const log = logger("CerbosService");

interface IAuthorize {
  actions: [string];
  resource: {
    policyVersion?: any;
    kind: string;
    instances: {
      [resourceKey: string]: {
        attr: {
          [key: string]: any;
        }
      }
    };
  };
  principal: User;
}

enum AuthorizeEffect {
  ALLOW = "EFFECT_ALLOW",
  DENY = "EFFECT_DENY",
}

interface IAuthorizeResponse {
  requestID: string;
  resourceInstances: {
    [resourceKey: string]: {
      actions: {
        [action: string]: AuthorizeEffect;
      }
    }
  };
}

export interface ICerbosResponse {
  isAuthorized: (resourceKey: string, action: string) => boolean
}

class CerbosResponseWrapper implements ICerbosResponse {
  readonly resp: IAuthorizeResponse;

  constructor(resp: IAuthorizeResponse) {
    this.resp = resp
  }

  isAuthorized(resourceKey: string, action: string): boolean {
    let allowed = this.resp.resourceInstances[resourceKey]?.actions[action] == AuthorizeEffect.ALLOW;
    return allowed ?? false
  }
}

export class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, "AUTHORIZATION_ERROR");
    Object.defineProperty(this, "name", { value: "AuthorizationError" });
  }
}

@Service({ global: true })
export class CerbosService {
  constructor() { }

  async authoize(data: IAuthorize): Promise<ICerbosResponse> {
    log.info(
      `authorize action: ${data.actions} principalId: ${data.principal.id}`
    );
    const payload = {
      requestId: uuidv4(),
      ...data,
      resource: {
        policyVersion: "default",
        ...data.resource,
      },
      principal: {
        policyVersion: "default",
        id: data.principal.id,
        roles: [data.principal.role.toString()],
        attr: {
          department: data.principal.department.toString(),
          region: data.principal.region?.toString(),
        },
      },
    };

    try {
      const response = await axios.post<IAuthorizeResponse>(
        `${config.cerbos.host}/api/check`,
        payload
      );
      console.log(response.data);
      return new CerbosResponseWrapper(response.data);
    } catch (e) {
      throw new AuthorizationError("Error authorizing");
    }
  }
}
