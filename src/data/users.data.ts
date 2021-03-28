import User from "../types/User.type";
import { Departments } from "./departments.data";
import { Region } from "./regions.data";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}


export const Users: User[] = [
  {
    id: 1,
    name: "Emre Admin",
    role: UserRole.ADMIN,
    department: Departments.IT,
    token: "key:emre:it",
  },
  {
    id: 2,
    name: "Joe Finance",
    role: UserRole.USER,
    department: Departments.FINANCE,
    token: "key:joe:finance",
    region: Region.EMEA,
  },
  {
    id: 3,
    name: "Sally Sales",
    role: UserRole.USER,
    department: Departments.SALES,
    token: "key:sally:sales",
    region: Region.EMEA,
  }
]


export const userById = (id: number): User => {
  return Users.find(c => c.id === id);
}