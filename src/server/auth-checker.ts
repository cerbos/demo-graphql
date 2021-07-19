// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { AuthChecker } from "type-graphql";

import logger from "../utils/logger";
import { IContext } from "./context.interface";
const log = logger("authChecker");

// create auth checker function
export const authChecker: AuthChecker<IContext> = (context, roles) => {
  // if (roles.length === 0) {
  //   // if `@Authorized()`, check only is user exist
  //   return profile !== undefined;
  // }
  // // there are some roles defined now

  // if (!profile) {
  //   // and if no user, restrict access
  //   return false;
  // }
  // if (user.roles.some(role => roles.includes(role))) {
  //   // grant access if the roles overlap
  //   return true;
  // }

  // no roles matched, restrict access
  return false;
};
