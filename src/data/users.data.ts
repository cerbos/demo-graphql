// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import type { Principal } from "@cerbos/core";
import { Department, Region, type User } from "../generated/graphql";

export enum UserRole {
	ADMIN = "ADMIN",
	USER = "USER",
	MANAGER = "MANAGER",
}

export const Users: Record<string, Principal> = {
	"key:sajit:it": {
		id: "user1",
		roles: [UserRole.ADMIN],
		attr: {
			name: "Sajit P",
			department: Department.It,
		},
	},
	"key:joe:finance": {
		id: "user2",
		roles: [UserRole.USER],
		attr: {
			name: "Joe Clark",
			department: Department.Finance,
			region: Region.Emea,
		},
	},
	"key:sally:sales": {
		id: "user3",
		roles: [UserRole.USER],
		attr: {
			name: "Sally Sales",
			department: Department.Finance,
			region: Region.Emea,
		},
	},
	"key:brock:manager-na": {
		id: "user4",
		roles: [UserRole.MANAGER],
		attr: {
			name: "Brock Jackman",
			department: Department.Sales,
			region: Region.Na,
		},
	},
	"key:john:manager-emea": {
		id: "user5",
		roles: [UserRole.MANAGER],
		attr: {
			name: "John Smith",
			department: Department.Sales,
			region: Region.Emea,
		},
	},
	"key:zeena:sales": {
		id: "user6",
		roles: [UserRole.USER],
		attr: {
			name: "Zeena",
			department: Department.Sales,
			region: Region.Emea,
		},
	},
};

export function userById(id: string): User {
	const principal = Object.values(Users).find((u) => u.id === id);
	if (!principal) {
		throw new Error(`User with id ${id} not found`);
	}
	const user = {
		id: principal.id,
		name: principal.attr.name as string,
		department: principal.attr.department as Department,
		region: principal.attr.region as Region,
	};
	return user;
}
