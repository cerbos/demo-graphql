import { ApolloError, AuthenticationError } from "apollo-server-errors";
import axios, { AxiosResponse } from "axios";
import { config } from "node-config-ts";
import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import User from "../types/User.type";
import logger from "../utils/logger";

const log = logger("CerbosService");

interface IAuthoize {
  action: string;
  resource: {
    version?: any;
    name: string;
    attr: any;
  };
  principal: User;
}

enum AuthoizeEffect {
  ALLOW = "EFFECT_ALLOW",
  DENY = "EFFECT_DENY",
}

interface IAuthoizeResponse {
  requestID: string;
  statusCode: number;
  statusMessage: string;
  effect: AuthoizeEffect;
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

  async authoize(data: IAuthoize): Promise<boolean> {
    log.info(
      `authorize action: ${data.action} principalId: ${data.principal.id}`
    );
    const payload = {
      requestId: uuidv4(),
      ...data,
      resource: {
        version: "default",
        ...data.resource,
      },
      principal: {
        version: "default",
        id: data.principal.id,
        roles: [data.principal.role.toString()],
        attr: {
          department: data.principal.department.toString(),
          region: data.principal.region?.toString(),
        },
      },
    };

    try {
      const response = await axios.post<IAuthoizeResponse>(
        `${config.cerbos.host}/v1/check`,
        payload
      );
      return response.data.effect == AuthoizeEffect.ALLOW;
    } catch (e) {
      throw new AuthorizationError("Error authorizing");
    }
  }
}
