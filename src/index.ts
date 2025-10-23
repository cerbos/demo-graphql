import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { type Context, createContext } from "./context";
import { resolvers } from "./resolvers/resolvers";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const server = new ApolloServer<Context>({
	typeDefs,
	resolvers,
	introspection: true,
});

async function bootstrap() {
	const { url } = await startStandaloneServer(server, {
		context: createContext,
		listen: {
			port: parseInt(process.env.PORT, 10) || 4000,
		},
	});

	console.log(`🚀 Server listening at: ${url}`);
}

bootstrap().catch((err) => {
	console.error(err);
	process.exit(1);
});
