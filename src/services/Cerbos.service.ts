import { ApolloError, AuthenticationError } from "apollo-server-errors";
import axios from "axios";
import { config } from "node-config-ts";
import { Service } from "typedi";
import { v4 as uuidv4 } from 'uuid';
import logger from "../utils/logger";

const log = logger('CerbosService');

interface IAuthoize {
  action: string,
  resource: {
    version?: any,
    name: string,
    attr: any
  },
  principal: {
    id: any,
    version?: any,
    roles: string[],
  }
}

class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, 'AUTHORIZATION_ERROR');
    Object.defineProperty(this, 'name', { value: 'AuthorizationError' });
  }
}


@Service({ global: true })
export class CerbosService {
  constructor() {
  }

  async authoize(data: IAuthoize): Promise<boolean> {
    log.info(`authorize action: ${data.action} princpalId: ${data.principal.id}`)
    const payload = {
      requestId: uuidv4(),
      ...data,
      resource: {
        version: "default",
        ...data.resource,
      },
      principal: {
        version: "default",
        ...data.principal,
      }
    };
    log.info(JSON.stringify(payload, null, 2));
    try {
      const request = await axios.post(`${config.cerbos.host}/v1/check`, payload)
      log.info("authorization: allow")
      return true
    } catch (e) {
      log.error(e)
      throw new AuthorizationError("Access denied");
    }
  }

}
