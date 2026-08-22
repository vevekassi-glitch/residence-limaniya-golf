/**
 * Client API — Résidence Azalaï
 * -----------------------------
 * Simulation navigateur du backend Laravel 12 (voir ARCHITECTURE.md).
 * Chaque fonction reproduit le contrat HTTP de son endpoint :
 *   checkAvailability()      → GET  /api/v1/availability
 *   createReservation()      → POST /api/v1/reservations
 *   initiateMobilePayment()  → POST /api/v1/payments/initiate  (CinetPay)
 *   pollPaymentStatus()      → GET  /api/v1/payments/{ref}/status
 *   payByCard()              → POST /api/v1/payments/card      (Stripe PaymentIntents)
 */
import { ApiError } from "./types";
import type { AvailabilityResult, CatalogItem, Contact, ItemKind, PayMethod, Quote } from "./types";
import { CATALOG } from "./data";

const VAT_RATE = 0.18;
const SERVICE_RATE = 0.07;

const latency = () => 450 + Math.random() * 450;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export function todayIso() {
  return isoDate(new Date());
}
export function addDaysIso(iso: string, days: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return isoDate(d);
}
export function nightsBetween(from: string, to: string) {
  const a = new Date(from + "T12:00:00").getTime();
  const b = new Date(to + "T12:00:00").getTime();
  return Math.max(1, Math.round((b - a) / 86400000));
}

/* hash déterministe → stock pseudo-aléatoire mais stable par (item, dates) */
function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getItem(id: string): CatalogItem {
  const item = CATALOG.find((c) => c.id === id);
  if (!item) throw new ApiError("ITEM_NOT_FOUND", "Cette référence n'existe plus au catalogue.");
  return item;
}

export function computeQuote(item: CatalogItem, from: string, to: string): Quote {
  const nights = nightsBetween(from, to);
  const base = item.price * nights;
  const vat = Math.round(base * VAT_RATE);
  const service = Math.round(base * SERVICE_RATE);
  return { base, nights, vat, service, total: base + vat + service };
}

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "").replace(/^225/, "");
  if (!/^\d{10}$/.test(digits)) return null;
  return "+225 " + digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/* ——— GET /api/v1/availability ——— */
export async function checkAvailability(itemId: string, from: string, to: string): Promise<AvailabilityResult> {
  await wait(latency());
  const item = getItem(itemId);
  if (!from || !to) throw new ApiError("VALIDATION", "Les dates d'arrivée et de départ sont requises.");
  // une salle se réserve à la journée : arrivée == départ est valide
  if (to < from || (to === from && item.kind === "room"))
    throw new ApiError("VALIDATION", "La date de départ doit être postérieure à l'arrivée.");
  if (from < todayIso()) throw new ApiError("VALIDATION", "Impossible de réserver dans le passé — même à Abidjan.");
  const h = hashCode(itemId + from + to);
  const remaining = item.kind === "hall" ? (h % 6 === 0 ? 0 : 1) : Math.max(h % 7 === 0 ? 0 : (h % item.stock) + 1, 0);
  return { itemId, from, to, remaining };
}

/* ——— POST /api/v1/reservations ——— */
export async function createReservation(args: {
  kind: ItemKind;
  itemId: string;
  from: string;
  to: string;
  guests: number;
  contact: Contact;
}): Promise<{ reference: string; quote: Quote }> {
  await wait(latency());
  const item = getItem(args.itemId);
  if (args.guests < 1 || args.guests > item.capacity)
    throw new ApiError("VALIDATION", `Capacité maximale : ${item.capacity} personnes pour ${item.name}.`);
  if (args.contact.name.trim().length < 3) throw new ApiError("VALIDATION", "Le nom complet est requis (3 caractères min.).");
  if (!validEmail(args.contact.email)) throw new ApiError("VALIDATION", "Adresse e-mail invalide.");
  if (!normalizePhone(args.contact.phone)) throw new ApiError("VALIDATION", "Numéro de téléphone invalide — 10 chiffres attendus (ex. 07 08 09 10 11).");
  const year = new Date().getFullYear();
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  return { reference: `AZL-${year}-${stamp}`, quote: computeQuote(item, args.from, args.to) };
}

/* registres simulés (en prod : tables payments / payment_logs) */
const mobileLedger = new Map<string, { startedAt: number; willFail: boolean }>();
let txCounter = 1841;

/* ——— POST /api/v1/payments/initiate (CinetPay) ——— */
export async function initiateMobilePayment(args: {
  reference: string;
  method: PayMethod;
  phone: string;
}): Promise<{ transactionRef: string; status: "PENDING"; message: string }> {
  await wait(latency());
  const phone = normalizePhone(args.phone);
  if (!phone) throw new ApiError("VALIDATION", "Numéro Mobile Money invalide — 10 chiffres attendus.");
  const digits = phone.replace(/\D/g, "");
  const willFail = digits.endsWith("0000"); // cas d'école : refus opérateur
  const transactionRef = `CP-${++txCounter}-${Date.now().toString().slice(-5)}`;
  mobileLedger.set(transactionRef, { startedAt: Date.now(), willFail });
  return {
    transactionRef,
    status: "PENDING",
    message: `Demande envoyée à ${phone}. Validez sur votre téléphone.`,
  };
}

/* ——— GET /api/v1/payments/{ref}/status ——— */
export async function pollPaymentStatus(transactionRef: string): Promise<{ status: "PENDING" | "CONFIRMED" | "FAILED"; message?: string }> {
  await wait(900);
  const entry = mobileLedger.get(transactionRef);
  if (!entry) throw new ApiError("NOT_FOUND", "Transaction introuvable.");
  if (Date.now() - entry.startedAt < 4200) return { status: "PENDING" };
  if (entry.willFail) return { status: "FAILED", message: "L'opérateur a rejeté la demande (solde insuffisant ou demande expirée). Aucune somme n'a été débitée." };
  mobileLedger.delete(transactionRef);
  return { status: "CONFIRMED" };
}

function luhnValid(num: string) {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

/* ——— POST /api/v1/payments/card (Stripe PaymentIntents) ——— */
export async function payByCard(args: {
  reference: string;
  method: PayMethod;
  cardNumber: string;
  expiry: string;
  cvc: string;
  holder: string;
}): Promise<{ transactionRef: string; status: "CONFIRMED"; authCode: string }> {
  const digits = args.cardNumber.replace(/\D/g, "");
  if (!luhnValid(digits)) throw new ApiError("VALIDATION", "Numéro de carte invalide (contrôle de Luhn échoué).");
  const m = args.expiry.match(/^(\d{2})\s?\/\s?(\d{2})$/);
  if (!m) throw new ApiError("VALIDATION", "Expiration invalide — format MM/AA.");
  const expDate = new Date(2000 + parseInt(m[2], 10), parseInt(m[1], 10), 0, 23, 59);
  if (expDate < new Date()) throw new ApiError("VALIDATION", "Cette carte est expirée.");
  if (!/^\d{3,4}$/.test(args.cvc)) throw new ApiError("VALIDATION", "Cryptogramme invalide (3 chiffres au dos de la carte).");
  if (args.holder.trim().length < 3) throw new ApiError("VALIDATION", "Nom du titulaire requis.");
  await wait(1900); // 3-D Secure
  if (digits.startsWith("0000")) throw new ApiError("DECLINED", "La banque émettrice a refusé le paiement (code 05). Essayez une autre carte.");
  const transactionRef = `PI-${++txCounter}-${digits.slice(-4)}`;
  return { transactionRef, status: "CONFIRMED", authCode: hashCode(transactionRef).toString(16).toUpperCase().slice(0, 6) };
}
