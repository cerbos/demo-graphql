import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import User from "../types/User.type";

export interface IContext {
  req: ExpressContext["req"];
  requestId: string;
  user: User;
}
