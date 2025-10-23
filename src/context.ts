import type { ContextFunction } from "@apollo/server";
import type { StandaloneServerContextFunctionArgument } from "@apollo/server/dist/esm/standalone";
import type { Principal } from "@cerbos/core";
import { GraphQLError } from "graphql";
import { Users } from "./data/users.data";
import { authorize } from "./services/Cerbos.service";

export interface Context {
	principal: Principal;
	authorizer: ReturnType<typeof authorize>;
}

export const createContext: ContextFunction<
	[StandaloneServerContextFunctionArgument],
	Context
> = async ({ req }) => {
	const token = (req.headers.token as string) || "";
	const principal = Users[token];
	if (!token || !principal) {
		throw new GraphQLError("User is not authenticated", {
			extensions: {
				code: "UNAUTHENTICATED",
				http: { status: 401 },
			},
		});
	}

	return {
		principal,
		authorizer: authorize(principal),
	};
};
