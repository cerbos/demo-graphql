// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import { Company, Region } from "../generated/graphql";

export const Companies: Company[] = [
  {
    id: "company1",
    name: "Candor Corp",
    region: Region.Emea,
  },
  {
    id: "company2",
    name: "Flux Water Gear",
    region: Region.Na,
  },
  {
    id: "company3",
    name: "Vortex Solar",
    region: Region.Na,
  },
];

export const companyById = (id: string): Company => {
  return Companies.find((c) => c.id === id);
};
