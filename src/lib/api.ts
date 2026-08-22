/**
 * Client API — Résidence Azalaï
 * -----------------------------
 * MODE DOUBLE :
 *  - Si VITE_API_URL est défini (fichier .env à la racine du front),
 *    les appels partent vers le vrai backend Laravel 12 (dossier /backend) :
 *        VITE_API_URL=http://127.0.0.1:8000/api/v1
 *  - Sinon, la couche simulation ci-dessous reproduit fidèlement les mêmes
 *    contrats HTTP (latence, validations, codes d'erreur) pour la démo.
 *
 * Correspondance des endpoints (voir backend/README.md) :
 *   checkAvailability()      → GET  /availability
 *   createReservation()      → POST /reservations
 *   initiateMobilePayment()  → POST /payments/initiate   (CinetPay)
 *   pollPaymentStatus()      → GET  /payments/{ref}/status
 *   payByCard()              → POST /payments/card       (Stripe PaymentIntents)
 */
import { ApiError } from "./types";
import type { AvailabilityResult, CatalogItem, Contact, ItemKind, PayMethod, Quote } from "./types";
import { CATALOG } from "./data";

const API_BASE: string | null =
  ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_URL ?? null);

async function remote<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...init,
  });
  const data: Record<string, unknown> = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data.code as string) ?? `HTTP_${res.status}`,
      (data.message as string) ?? "Le serveur a renvoyé une erreur."
    );
  }
  return data as T;
}

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

/* ——— GET /availability ——— */
export async function checkAvailability(itemId: string, from: string, to: string): Promise<AvailabilityResult> {
  if (API_BASE) {
    return remote<AvailabilityResult>(`/availability?item_id=${encodeURIComponent(itemId)}&from=${from}&to=${to}`);
  }
  await wait(latency());
  const item = getItem(itemId);
  if (!from || !to) throw new ApiError("VALIDATION", "Les dates d'arrivée et de départ sont requises.");
  if (to < from) throw new ApiError("VALIDATION", "La date de départ doit être postérieure à l'arrivée.");
  if (to === from && item.kind !== "hall") throw new ApiError("VALIDATION", "La date de départ doit être postérieure à l'arrivée.");
  if (from < todayIso()) throw new ApiError("VALIDATION", "Impossible de réserver dans le passé — même à Abidjan.");
  const h = hashCode(itemId + from + to);
  const remaining = item.kind === "hall" ? (h % 9 === 0 ? 0 : 1) : h % 13 === 0 ? 0 : (h % item.stock) + 1;
  return { itemId, from, to, remaining };
}

/* ——— POST /reservations ——— */
export async function createReservation(args: {
  kind: ItemKind;
  itemId: string;
  from: string;
  to: string;
  guests: number;
  contact: Contact;
}): Promise<{ reference: string; quote: Quote }> {
  if (API_BASE) {
    return remote<{ reference: string; quote: Quote }>("/reservations", {
      method: "POST",
      body: JSON.stringify({
        kind: args.kind,
        item_id: args.itemId,
        from: args.from,
        to: args.to,
        guests: args.guests,
        name: args.contact.name,
        email: args.contact.email,
        phone: args.contact.phone,
      }),
    });
  }
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

/* ——— POST /payments/initiate (CinetPay) ——— */
export async function initiateMobilePayment(args: {
  reference: string;
  method: PayMethod;
  phone: string;
}): Promise<{ transactionRef: string; status: "PENDING"; message: string }> {
  if (API_BASE) {
    const res = await remote<{ transaction_ref: string; status: string; message: string }>("/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ reference: args.reference, method: args.method, phone: args.phone }),
    });
    return { transactionRef: res.transaction_ref, status: "PENDING", message: res.message };
  }
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

/* ——— GET /payments/{ref}/status ——— */
export async function pollPaymentStatus(transactionRef: string): Promise<{ status: "PENDING" | "CONFIRMED" | "FAILED"; message?: string }> {
  if (API_BASE) {
    return remote<{ status: "PENDING" | "CONFIRMED" | "FAILED"; message?: string }>(
      `/payments/${encodeURIComponent(transactionRef)}/status`
    );
  }
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

/* ——— POST /payments/card (Stripe PaymentIntents) ——— */
export async function payByCard(args: {
  reference: string;
  method: PayMethod;
  cardNumber: string;
  expiry: string;
  cvc: string;
  holder: string;
  /** En mode API réelle : payment_method_id fourni par Stripe Elements (voir backend/README.md §5). */
  paymentMethodId?: string;
}): Promise<{ transactionRef: string; status: "CONFIRMED"; authCode: string }> {
  if (API_BASE) {
    if (!args.paymentMethodId) {
      throw new ApiError(
        "INTEGRATION",
        "En mode API réelle, la saisie carte doit passer par Stripe Elements (payment_method_id) — voir backend/README.md §5."
      );
    }
    const res = await remote<{ transaction_ref: string; status: string }>("/payments/card", {
      method: "POST",
      body: JSON.stringify({ reference: args.reference, payment_method_id: args.paymentMethodId }),
    });
    if (res.status !== "CONFIRMED" && res.status !== "REQUIRES_ACTION") {
      throw new ApiError("DECLINED", "Le paiement carte n'a pas abouti.");
    }
    return { transactionRef: res.transaction_ref, status: "CONFIRMED", authCode: "" };
  }
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
