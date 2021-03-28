
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
    id: "invoice1",
    createdAt: new Date('2021-10-01'),
    createdBy: userById("user3"),
    invoiceTo: companyById("company2"),
    region: Region.EMEA,
    amount: 2421.12,
    status: InvoiceStatus.OPEN,
  },
  {
    id: "invoice2",
    createdAt: new Date('2021-10-01'),
    createdBy: userById("user3"),
    invoiceTo: companyById("company3"),
    region: Region.EMEA,
    amount: 513.50,
    status: InvoiceStatus.APPROVED,
    approvedBy: userById("user2")
  }
];


export const invoiceById = (id: string): Invoice => {
  return Invoices.find(c => c.id === id);
}