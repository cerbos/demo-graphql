# Demo GraphQL

This project showcases using Cerbos inside of a GraphQL server. The server is written in typescript and makes used of [type-graphql](https://typegraphql.com/) to create the schema and resolvers.

## Setup

- Have Node v12+ on your machine (recommend using NVM)
- Ensure your Docker is setup to pull `ghcr.io/cerbos/cerbos:0.0.0-alpha1`
- Run `npm install` to get the node dependancies.

## Running

Cerbos is running seperately in a docker container to the application and served on [http://localhost:9999](http://localhost:9999). To start this run `cerbos/start.sh`

To boot the GraphQL server run `npm run start`

Once running, you can access GraphQL Playground [http://localhost:5000/graphql](http://localhost:5000/graphql)

## Sample Queries

Coming soon....
