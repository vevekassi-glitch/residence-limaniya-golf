export type ItemKind = "room" | "hall";

export interface CatalogItem {
  id: string;
  kind: ItemKind;
  name: string;
  tagline: string;
  description: string;
  price: number; // FCFA HT
  unit: "nuit" | "jour";
  capacity: number;
  size: number; // m²
  beds?: string;
  configs?: { label: string; value: number }[]; // dispositions salle
  features: string[];
  img: string;
  stock: number;
  badge?: string;
}

export type PayMethod = "wave" | "orange" | "mtn" | "moov" | "visa" | "stripe";

export interface Quote {
  base: number;
  nights: number;
  vat: number;
  service: number;
  total: number;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
}

export interface Reservation {
  reference: string;
  kind: ItemKind;
  itemId: string;
  itemName: string;
  from: string;
  to: string;
  nights: number;
  guests: number;
  contact: Contact;
  quote: Quote;
  method: PayMethod;
  transactionRef: string;
  createdAt: string;
}

export interface AvailabilityResult {
  itemId: string;
  from: string;
  to: string;
  remaining: number;
}

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
