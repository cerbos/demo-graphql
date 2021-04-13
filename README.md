# Demo GraphQL

This project showcases using Cerbos inside of a GraphQL server. The server is written in typescript and makes used of [type-graphql](https://typegraphql.com/) to create the schema and resolvers.

## Setup

- Have Node v12+ on your machine (recommend using NVM)
- Ensure your Docker is setup to pull `ghcr.io/cerbos/cerbos:0.0.0-alpha4`
- Run `npm install` to get the node dependancies.

## Running

Cerbos is running seperately in a docker container to the application and served on [http://localhost:9999](http://localhost:9999). To start this run `cerbos/start.sh`

To boot the GraphQL server run `npm run start`

Once running, you can access GraphQL Playground [http://localhost:5000/graphql](http://localhost:5000/graphql)

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

Coming soon....
