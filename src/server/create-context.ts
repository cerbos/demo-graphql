import { AuthenticationError } from "apollo-server-errors";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import DataLoader from "dataloader";
import Container from "typedi";
import { Users } from "../data/users.data";
import {
  CerbosService,
  ICerbosBatchAuthorizeResource,
} from "../services/Cerbos.service";
import logger from "../utils/logger";
import { IContext } from "./context.interface";

const log = logger("createContext");

export default async (request: ExpressContext): Promise<IContext> => {
  // Create a new request container
  const requestId = Math.floor(
    Math.random() * Number.MAX_SAFE_INTEGER
  ).toString();
  const container = Container.of(requestId);
  const cerbosService = Container.get(CerbosService);

  // No token set access is denied
  if (!request.req.headers["token"])
    throw new AuthenticationError("Access denied: No token provided");

  // DO SOME ACTUAL AUTHENTICATION AGAINST A DB etc
  const user = Users.find((u) => u.token === request.req.headers["token"]);

  // User not found so denied
  if (!user) throw new AuthenticationError("Access denied: Token not valid");

  // Set the context in the container
  const context: IContext = {
    req: request.req,
    requestId,
    user,
    loaders: {
      authorize: new DataLoader(
        async (resources: ICerbosBatchAuthorizeResource[]) => {
          const results = await cerbosService.authorizeBatch({
            principal: {
              id: user.id,
              roles: [user.role.toString()],
              attr: user,
            },
            resources,
          });
          return resources.map(
            (key) =>
              results.find((u) => u.resourceId === key.resource.id).actions
          );
        }
      ),
    },
  };
  container.set("context", context);

  return context;
};
