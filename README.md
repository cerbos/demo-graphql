# Demo GraphQL

This project showcases using Cerbos inside of a GraphQL server. The server is written in typescript and makes used of [type-graphql](https://typegraphql.com/) to create the schema and resolvers and [TypeDI](https://github.com/typestack/typedi) to handle dependency injection.

The Cerbos client is setup as a [global service](/src/services/Cerbos.service.ts) which is then used in the GraphQL server. 

To enable batching of requests, the authorization calls are performed via a [dataloader](https://github.com/graphql/dataloader) instance which is configured per-request in the [GraphQL server context](/src/server/create-context.ts) and automatically adds in the principal information from the request.

```ts
new DataLoader(
  async (resources: ResourceCheck[]) => {
    const results = await cerbosService.cerbos.checkResources({
      principal: {
        id: user.id,
        roles: [user.role.toString()],
        attributes: JSON.parse(JSON.stringify(user)),
      },
      resources,
    });
    return resources.map(
      (key) =>
        results.findResult({ kind: key.resource.kind, id: key.resource.id })
    );
  }
)
```

Inside the GraphQL resolvers, calls to Cerbos can be done via using the context:

```ts
const authorized = await context.loaders.authorize.load({
  actions: ["view:approver"],
  resource: {
    id: expense.id,
    kind: "expense:object",
    attributes: {
      id: expense.id,
      region: expense.region,
      status: expense.status,
      ownerId: expense.createdBy.id,
    },
  },
});
```

## Setup

- Have Node v18+ on your machine (recommend using NVM)
- Ensure your Docker is setup to pull `ghcr.io/cerbos/cerbos:latest`
- Run `npm install` to get the node dependencies.

## Running

Cerbos is running separately in a docker container to the application and served on http://localhost:3593. To start this run `cd cerbos && ./start.sh`

To boot the GraphQL server run `npm run start`

Once running, you can access GraphQL Playground [http://localhost:8000/graphql](http://localhost:8000/graphql)

## Policies

- IT can do everything
- Users can create invoices
- Users can view their invoices
- Users can update their own un-approved invoices
- Users can delete their own un-approved invoices
- Managers view all invoices in their region
- Managers update un-approved invoices in their region
- Managers delete un-approved invoices in their region
- Finance can view all invoices
- Finance can approve all invoices

## Sample Queries

To run these you need to set an HTTP header called `token` which identifies the user (and thus there permissions)

Some exampe tokens:

- `key:sajit:it` is an IT Admin
- `key:joe:finance` is an EMEA Finance person
- `key:sally:sales` is an EMEA Sales person
- `key:zeena:sales` is an North America sales person
- `key:john:manager-emea` is an EMEA Manager in sales
- `key:brock:manager-na` is an North America Manager in sales

### Get an Expense

```
{
  expense(id: "expense2") {
    id
    amount
    status
    vendor {
      name
    }
    createdBy {
      name
    }
    approvedBy {
      name
    }
  }
}
```

### Approve an Expense

```
mutation {
  approveExpense(id: "expense1")
}
```

## Demo Video - Watch this demo with commentary

<a href="https://www.loom.com/share/cb213efcc1674229b0084a7198b232e5">
    <p>Cerbos GraphQL Demo - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/cb213efcc1674229b0084a7198b232e5-with-play.gif">
</a>

## Playground

Launch the policy from this demo in our playground. Play with it to see how Cerbos behaves.

<P><a href="https://play.cerbos.dev/p/XhkOi82fFKk3YW60e2c806Yvm0trKEje"><img src="https://github.com/cerbos/express-jwt-cerbos/blob/main/docs/launch.jpg"></a></p>
