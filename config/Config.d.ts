/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    port: number
    log: string
    graphql: Graphql
    cerbos: Cerbos
  }
  interface Cerbos {
    host: string
    tls: boolean
  }
  interface Graphql {
    playground: boolean
    tracing: boolean
    introspection: boolean
  }
  export const config: Config
  export type Config = IConfig
}
