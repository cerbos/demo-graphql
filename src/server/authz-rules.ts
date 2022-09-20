// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { IAuthConfig, postExecRule, preExecRule } from "@graphql-authz/core";
import { config } from "node-config-ts";
import { Extensions } from "type-graphql";
import { IContext } from "./context.interface";
import { GRPC as Cerbos } from "@cerbos/grpc"
import { ApolloError } from "apollo-server-express";
import Container from "typedi";
import { ExpensesService } from "../services/Expenses.service";

const cerbos = new Cerbos(config.cerbos.host, { tls: config.cerbos.tls });

export class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, "AUTHORIZATION_ERROR");
    Object.defineProperty(this, "name", { value: "AuthorizationError" });
  }
}




const IsAuthenticated = preExecRule({
  error: 'User is not authenticated'
})((context: IContext) => !!context.user);


const CanReadExpense = postExecRule({
  error: 'Access denied',
  selectionSet: '{ id region status createdBy { id } }'
})(
  async (
    context: IContext,
    fieldArgs: unknown,
    expense: { id: string; region: string; status: string; createdBy: { id: string } }
  ) => {

    const authorized = await cerbos.checkResource({
      principal: {
        id: context.user.id,
        roles: [context.user.role.toString()],
        attributes: JSON.parse(JSON.stringify(context.user)),
      },
      resource: {
        id: expense.id,
        kind: "expense:object",
        attributes: {
          id: expense.id,
          region: expense.region.toString(),
          status: expense.status.toString(),
          ownerId: expense.createdBy.id,
        },
      },
      actions: ["view"],
    });

    return authorized.isAllowed("view")
  }
);

const CanReadExpenseApprover = postExecRule({
  error: 'Access denied',
  selectionSet: '{ id region status createdBy { id } }'
})(
  async (
    context: IContext,
    fieldArgs: unknown,
    expense: { id: string; region: string; status: string; createdBy: { id: string } }
  ) => {
    console.log(expense)
    const authorized = await cerbos.checkResource({
      principal: {
        id: context.user.id,
        roles: [context.user.role.toString()],
        attributes: JSON.parse(JSON.stringify(context.user)),
      },
      resource: {
        id: expense.id,
        kind: "expense:object",
        attributes: {
          id: expense.id,
          region: expense.region.toString(),
          status: expense.status.toString(),
          ownerId: expense.createdBy.id,
        },
      },
      actions: ["view:approver"],
    });

    console.log(authorized)

    return authorized.isAllowed("view:approver")
  }
)

const CanApproveExpense = preExecRule()(
  async (context: IContext, fieldArgs: { id: string }) => {
    const svc = Container.get<ExpensesService>("ExpensesService");
    const expense = await svc.get(fieldArgs.id);
    if (!expense) return false;

    const authorized = await cerbos.checkResource({
      principal: {
        id: context.user.id,
        roles: [context.user.role.toString()],
        attributes: JSON.parse(JSON.stringify(context.user)),
      },
      resource: {
        id: expense.id,
        kind: "expense:object",
        attributes: {
          id: expense.id,
          region: expense.region.toString(),
          status: expense.status.toString(),
          ownerId: expense.createdBy.id,
        },
      },
      actions: ["approve"],
    });
    return authorized.isAllowed("approve")
  }
)

// const CanPublishPost = preExecRule()(
//   async (context: IContext, fieldArgs: { postId: string }) => {
//     const post = await Promise.resolve(
//       posts.find(({ id }) => id === fieldArgs.postId)
//     );
//     return !post || post.authorId === context.user?.id;
//   }
// );

export const authZRules = {
  IsAuthenticated,
  CanReadExpense,
  CanReadExpenseApprover,
  CanApproveExpense
} as const;


export function AuthZ(args: IAuthConfig<typeof authZRules>) {
  return Extensions({
    authz: {
      directives: [
        {
          name: 'authz',
          arguments: args
        }
      ]
    }
  });
}