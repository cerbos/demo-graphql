// Copyright 2021 Zenauth Ltd.
// SPDX-License-Identifier: Apache-2.0

import Company from "../types/Company.type";
import { Region } from "./regions.data";

export const Companies: Company[] = [
  {
    id: "company1",
    name: "Candor Corp",
    region: Region.EMEA,
  },
  {
    id: "company2",
    name: "Flux Water Gear",
    region: Region.NA,
  },
  {
    id: "company3",
    name: "Vortex Solar",
    region: Region.NA,
  },
];

export const companyById = (id: string): Company => {
  return Companies.find((c) => c.id === id);
};
