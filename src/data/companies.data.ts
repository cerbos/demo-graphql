import Company from "../types/Company.type";
import { Region } from "./regions.data";


export const Companies: Company[] = [
  {
    id: 1,
    name: "Candor Corp",
    region: Region.EMEA,
  },
  {
    id: 2,
    name: "Flux Water Gear",
    region: Region.NA,
  },
  {
    id: 3,
    name: "Vortex Solar",
    region: Region.NA,
  }
];

export const companyById = (id: number): Company => {
  return Companies.find(c => c.id === id);
}