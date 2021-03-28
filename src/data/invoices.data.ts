
import Invoice from "../types/Invoice.type";
import { companyById } from "./companies.data";
import { Region } from "./regions.data";
import { userById } from "./users.data";

export enum InvoiceStatus {
  OPEN = "OPEN",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}


export const Invoices: Invoice[] = [
  {
    id: 1,
    createdAt: new Date('2021-10-01'),
    createdBy: userById(3),
    invoiceTo: companyById(2),
    region: Region.EMEA,
    amount: 2421.12,
    status: InvoiceStatus.OPEN,
  },
  {
    id: 2,
    createdAt: new Date('2021-10-01'),
    createdBy: userById(3),
    invoiceTo: companyById(3),
    region: Region.EMEA,
    amount: 513.50,
    status: InvoiceStatus.APPROVED,
    approvedBy: userById(2)
  }
];


export const invoiceById = (id: number): Invoice => {
  return Invoices.find(c => c.id === id);
}