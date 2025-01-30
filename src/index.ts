import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Principal } from "@cerbos/core";
import { Users } from "./data/users.data";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers/resolvers";
import { GraphQLError } from "graphql";
import { authorize } from "./services/Cerbos.service";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

export interface Context {
  principal: Principal;
  authorizer: ReturnType<typeof authorize>;
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: true,
});

async function bootstrap() {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = (req.headers.token as string) || "key:sajit:it";
      if (!token)
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      return {
        principal: Users[token],
        authorizer: authorize(Users[token]),
      };
    },
    listen: {
      port: parseInt(process.env.PORT) || 4000,
    },
  });

  console.log(`🚀 Server listening at: ${url}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
