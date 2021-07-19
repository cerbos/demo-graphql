// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import User from "../types/User.type";
import { Departments } from "./departments.data";
import { Region } from "./regions.data";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
}

export const Users: User[] = [
  {
    id: "user1",
    name: "Sajit P",
    role: UserRole.ADMIN,
    department: Departments.IT,
    token: "key:sajit:it",
  },
  {
    id: "user2",
    name: "Joe Clark",
    role: UserRole.USER,
    department: Departments.FINANCE,
    token: "key:joe:finance",
    region: Region.EMEA,
  },
  {
    id: "user3",
    name: "Sally Sales",
    role: UserRole.USER,
    department: Departments.SALES,
    token: "key:sally:sales",
    region: Region.EMEA,
  },
  {
    id: "user4",
    name: "Brock Jackman",
    role: UserRole.MANAGER,
    department: Departments.SALES,
    token: "key:brock:manager-na",
    region: Region.NA,
  },
  {
    id: "user5",
    name: "John Smith",
    role: UserRole.MANAGER,
    department: Departments.SALES,
    token: "key:john:manager-emea",
    region: Region.EMEA,
  },
  {
    id: "user6",
    name: "Zeena",
    role: UserRole.USER,
    department: Departments.SALES,
    token: "key:zeena:sales",
    region: Region.NA,
  },
];

export const userById = (id: string): User => {
  return Users.find((c) => c.id === id);
};
