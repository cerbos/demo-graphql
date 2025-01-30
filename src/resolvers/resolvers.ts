import { GraphQLDateTime } from "graphql-scalars";
import { expenseById, Expenses } from "../data/expenses.data";
import { Resolvers } from "../generated/graphql";
import { AuthorizationError, authorize } from "../services/Cerbos.service";

export const resolvers: Resolvers = {
  Query: {
    expense: async (_, { id }, { authorizer }) => {
      const expense = expenseById(id);

      const authorized = await authorizer.checkResource(
        {
          kind: "expense:object",
          id: expense.id,
          attributes: {
            id: expense.id,
            region: expense.region.toString(),
            status: expense.status.toString(),
            ownerId: expense.createdBy.id,
          },
        },
        "view"
      );

      if (!authorized) {
        throw new AuthorizationError("Unauthorized");
      }
      return expense;
    },
    expenses: async (_, __, { authorizer }) => {
      const expensesAuthorization = await Promise.all(
        Expenses.map((expense) => {
          return authorizer.checkResource(
            {
              kind: "expense:object",
              id: expense.id,
              attributes: {
                id: expense.id,
                region: expense.region.toString(),
                status: expense.status.toString(),
                ownerId: expense.createdBy.id,
              },
            },
            "view"
          );
        })
      );

      return Expenses.filter((_, index) => expensesAuthorization[index]);
    },
  },

  Mutation: {
    approveExpense: async (_, { id }, { authorizer }) => {
      const expense = expenseById(id);

      const authorized = await authorizer.checkResource(
        {
          kind: "expense:object",
          id: expense.id,
          attributes: {
            id: expense.id,
            region: expense.region.toString(),
            status: expense.status.toString(),
            ownerId: expense.createdBy.id,
          },
        },
        "approve"
      );

      if (!authorized) {
        throw new AuthorizationError("Unauthorized");
      }
      return expense;
    },
  },
  DateTime: GraphQLDateTime,
};
