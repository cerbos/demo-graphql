// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import type {
	CheckResourcesResult,
	Principal,
	Resource,
	ResourceCheck,
} from "@cerbos/core";
import { GRPC as Cerbos } from "@cerbos/grpc";
import DataLoader from "dataloader";
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

const cerbos = new Cerbos(process.env.CERBOS_GRPC || "localhost:3593", {
	tls: false,
});

export function authorize(principal: Principal) {
	const loader = new DataLoader(async (resources: readonly ResourceCheck[]) => {
		const results = await cerbos.checkResources({
			principal,
			resources: resources as ResourceCheck[],
		});
		return resources.map(
			(key) =>
				results.findResult({
					kind: key.resource.kind,
					id: key.resource.id,
				}) as CheckResourcesResult,
		);
	});

	return {
		async checkResource(resource: Resource, action: string) {
			const result = await loader.load({
				resource: {
					kind: resource.kind,
					id: resource.id,
					attr: resource.attr,
				},
				actions: [action],
			});
			return result.isAllowed(action);
		},
	};
}
