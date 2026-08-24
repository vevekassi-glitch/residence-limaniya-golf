import { describe, it, expect } from "vitest";
import {
  todayIso,
  addDaysIso,
  nightsBetween,
  getItem,
  computeQuote,
  normalizePhone,
  validEmail,
  checkAvailability,
  createReservation,
  initiateMobilePayment,
  pollPaymentStatus,
  payByCard,
} from "../api";


/* ——— todayIso ——— */
describe("todayIso", () => {
  it("returns a YYYY-MM-DD string", () => {
    const result = todayIso();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns today's date", () => {
    const result = todayIso();
    const now = new Date();
    const expected = now.toISOString().slice(0, 10);
    expect(result).toBe(expected);
  });
});

/* ——— addDaysIso ——— */
describe("addDaysIso", () => {
  it("adds one day", () => {
    expect(addDaysIso("2026-08-24", 1)).toBe("2026-08-25");
  });

  it("adds multiple days across month boundary", () => {
    expect(addDaysIso("2026-08-30", 3)).toBe("2026-09-02");
  });

  it("adds zero days", () => {
    expect(addDaysIso("2026-08-24", 0)).toBe("2026-08-24");
  });

  it("adds a large number of days", () => {
    expect(addDaysIso("2026-01-01", 365)).toBe("2027-01-01");
  });

  it("handles leap year", () => {
    expect(addDaysIso("2028-02-28", 1)).toBe("2028-02-29");
  });
});

/* ——— nightsBetween ——— */
describe("nightsBetween", () => {
  it("returns 1 for same-day range (hall)", () => {
    expect(nightsBetween("2026-08-24", "2026-08-24")).toBe(1);
  });

  it("returns 1 for a one-night stay", () => {
    expect(nightsBetween("2026-08-24", "2026-08-25")).toBe(1);
  });

  it("returns 3 for a three-night stay", () => {
    expect(nightsBetween("2026-08-24", "2026-08-27")).toBe(3);
  });

  it("returns minimum 1 even if to < from", () => {
    expect(nightsBetween("2026-08-27", "2026-08-24")).toBe(1);
  });
});

/* ——— getItem ——— */
describe("getItem", () => {
  it("returns an existing item", () => {
    const item = getItem("ch-verte");
    expect(item).toBeDefined();
    expect(item.name).toBe("Chambre Verte");
    expect(item.kind).toBe("room");
    expect(item.price).toBe(45000);
  });

  it("returns a hall item", () => {
    const item = getItem("am-phare");
    expect(item.name).toBe("Amphithéâtre Le Phare");
    expect(item.kind).toBe("hall");
    expect(item.price).toBe(350000);
  });

  it("throws ApiError for unknown id", () => {
    expect(() => getItem("nonexistent")).toThrow("Cette référence n'existe plus au catalogue.");
  });
});

/* ——— computeQuote ——— */
describe("computeQuote", () => {
  const chambre = getItem("ch-verte"); // 45 000 F / nuit

  it("computes a 1-night quote with VAT 18% and service 7%", () => {
    const quote = computeQuote(chambre, "2026-08-24", "2026-08-25");
    expect(quote.nights).toBe(1);
    expect(quote.base).toBe(45000);
    expect(quote.vat).toBe(8100); // 45000 * 0.18 = 8100
    expect(quote.service).toBe(3150); // 45000 * 0.07 = 3150
    expect(quote.total).toBe(45000 + 8100 + 3150); // 56 250
  });

  it("computes a 3-night quote", () => {
    const quote = computeQuote(chambre, "2026-08-24", "2026-08-27");
    expect(quote.nights).toBe(3);
    expect(quote.base).toBe(135000);
    expect(quote.vat).toBe(24300);
    expect(quote.service).toBe(9450);
    expect(quote.total).toBe(135000 + 24300 + 9450);
  });

  it("computes correctly for halls (same-day = 1 day)", () => {
    const hall = getItem("am-phare"); // 350 000 F / jour
    const quote = computeQuote(hall, "2026-09-01", "2026-09-01");
    expect(quote.nights).toBe(1);
    expect(quote.base).toBe(350000);
  });

  it("rounds tax amounts to integers", () => {
    // Use an item where the math would produce decimals
    const item = { ...chambre, price: 33333 };
    const quote = computeQuote(item, "2026-08-24", "2026-08-25");
    expect(Number.isInteger(quote.vat)).toBe(true);
    expect(Number.isInteger(quote.service)).toBe(true);
    expect(Number.isInteger(quote.total)).toBe(true);
  });
});

/* ——— normalizePhone ——— */
describe("normalizePhone", () => {
  it("normalizes a 10-digit number", () => {
    expect(normalizePhone("0708091011")).toBe("+225 07 08 09 10 11");
  });

  it("normalizes a number with spaces", () => {
    expect(normalizePhone("07 08 09 10 11")).toBe("+225 07 08 09 10 11");
  });

  it("strips the +225 prefix", () => {
    expect(normalizePhone("+225 07 08 09 10 11")).toBe("+225 07 08 09 10 11");
  });

  it("returns null for too short numbers", () => {
    expect(normalizePhone("070809")).toBeNull();
  });

  it("returns null for too long numbers", () => {
    expect(normalizePhone("070809101112")).toBeNull();
  });

  it("returns null for non-numeric input", () => {
    expect(normalizePhone("abcdefghij")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(normalizePhone("")).toBeNull();
  });
});

/* ——— validEmail ——— */
describe("validEmail", () => {
  it("accepts a valid email", () => {
    expect(validEmail("awa@exemple.ci")).toBe(true);
  });

  it("accepts email with subdomains", () => {
    expect(validEmail("user@mail.example.com")).toBe(true);
  });

  it("rejects missing @", () => {
    expect(validEmail("awaexemple.ci")).toBe(false);
  });

  it("rejects missing domain", () => {
    expect(validEmail("awa@")).toBe(false);
  });

  it("rejects missing TLD", () => {
    expect(validEmail("awa@exemple")).toBe(false);
  });

  it("rejects single-char TLD", () => {
    expect(validEmail("awa@ex.c")).toBe(false);
  });

  it("accepts trimmed input", () => {
    expect(validEmail("  awa@exemple.ci  ")).toBe(true);
  });
});

/* ——— checkAvailability (simulation) ——— */
describe("checkAvailability", () => {
  it("returns a result with remaining for a valid room", async () => {
    const result = await checkAvailability("ch-verte", "2026-09-01", "2026-09-03");
    expect(result.itemId).toBe("ch-verte");
    expect(result.remaining).toBeGreaterThanOrEqual(0);
    expect(result.remaining).toBeLessThanOrEqual(14); // stock = 14
  });

  it("throws on past dates", async () => {
    await expect(
      checkAvailability("ch-verte", "2020-01-01", "2020-01-02")
    ).rejects.toThrow(/réserver dans le passé/);
  });

  it("throws on date range with to < from", async () => {
    await expect(
      checkAvailability("ch-verte", "2026-09-05", "2026-09-01")
    ).rejects.toThrow("postérieure");
  });

  it("throws on missing dates", async () => {
    await expect(
      checkAvailability("ch-verte", "", "2026-09-02")
    ).rejects.toThrow("requises");
  });

  it("returns 0 or 1 for halls (stock=1)", async () => {
    const result = await checkAvailability("am-phare", "2026-10-01", "2026-10-01");
    expect(result.remaining).toBeGreaterThanOrEqual(0);
    expect(result.remaining).toBeLessThanOrEqual(1);
  });
});

/* ——— createReservation (simulation) ——— */
describe("createReservation", () => {
  it("creates a reservation with a valid AZL reference", async () => {
    const { reference, quote } = await createReservation({
      kind: "room",
      itemId: "ch-verte",
      from: "2026-09-01",
      to: "2026-09-03",
      guests: 2,
      contact: { name: "Awa N'Diaye", email: "awa@test.ci", phone: "0708091011" },
    });

    expect(reference).toMatch(/^AZL-\d{4}-[A-Z0-9]+$/);
    expect(quote.nights).toBe(2);
    expect(quote.total).toBeGreaterThan(0);
  });

  it("rejects guests exceeding capacity", async () => {
    await expect(
      createReservation({
        kind: "room",
        itemId: "ch-verte", // capacity 2
        from: "2026-09-01",
        to: "2026-09-02",
        guests: 5,
        contact: { name: "Awa N'Diaye", email: "awa@test.ci", phone: "0708091011" },
      })
    ).rejects.toThrow("Capacité maximale");
  });

  it("rejects invalid email", async () => {
    await expect(
      createReservation({
        kind: "room",
        itemId: "ch-verte",
        from: "2026-09-01",
        to: "2026-09-02",
        guests: 1,
        contact: { name: "Awa N'Diaye", email: "not-an-email", phone: "0708091011" },
      })
    ).rejects.toThrow("e-mail invalide");
  });

  it("rejects short name", async () => {
    await expect(
      createReservation({
        kind: "room",
        itemId: "ch-verte",
        from: "2026-09-01",
        to: "2026-09-02",
        guests: 1,
        contact: { name: "Ab", email: "awa@test.ci", phone: "0708091011" },
      })
    ).rejects.toThrow("nom complet est requis");
  });

  it("rejects invalid phone", async () => {
    await expect(
      createReservation({
        kind: "room",
        itemId: "ch-verte",
        from: "2026-09-01",
        to: "2026-09-02",
        guests: 1,
        contact: { name: "Awa N'Diaye", email: "awa@test.ci", phone: "123" },
      })
    ).rejects.toThrow("téléphone invalide");
  });
});

/* ——— initiateMobilePayment (simulation) ——— */
describe("initiateMobilePayment", () => {
  it("initiates a mobile payment with PENDING status", async () => {
    const result = await initiateMobilePayment({
      reference: "AZL-2026-TEST01",
      method: "wave",
      phone: "0708091011",
    });

    expect(result.status).toBe("PENDING");
    expect(result.transactionRef).toMatch(/^CP-/);
    expect(result.message).toContain("Demande envoyée");
  });

  it("rejects invalid phone number", async () => {
    await expect(
      initiateMobilePayment({
        reference: "AZL-2026-TEST01",
        method: "orange",
        phone: "12",
      })
    ).rejects.toThrow("Numéro Mobile Money invalide");
  });
});

/* ——— pollPaymentStatus (simulation) ——— */
describe("pollPaymentStatus", () => {
  it("returns PENDING for a new transaction", async () => {
    const { transactionRef } = await initiateMobilePayment({
      reference: "AZL-2026-POLL01",
      method: "wave",
      phone: "0708091011",
    });

    // Immediately polling should return PENDING
    const status = await pollPaymentStatus(transactionRef);
    expect(status.status).toBe("PENDING");
  });

  it("throws for unknown transaction reference", async () => {
    await expect(pollPaymentStatus("CP-99999-99999")).rejects.toThrow("Transaction introuvable");
  });
});

/* ——— payByCard (simulation) ——— */
describe("payByCard", () => {
  it("confirms a valid card payment", async () => {
    const result = await payByCard({
      reference: "AZL-2026-CARD01",
      method: "visa",
      cardNumber: "4242 4242 4242 4242",
      expiry: "12 / 28",
      cvc: "123",
      holder: "A. N'DIAYE",
    });

    expect(result.status).toBe("CONFIRMED");
    expect(result.transactionRef).toMatch(/^PI-/);
    expect(result.authCode).toMatch(/^[0-9A-F]+$/);
  });

  it("rejects a card that fails Luhn check", async () => {
    await expect(
      payByCard({
        reference: "AZL-2026-CARD02",
        method: "visa",
        cardNumber: "1234 5678 9012 3456",
        expiry: "12 / 28",
        cvc: "123",
        holder: "A. N'DIAYE",
      })
    ).rejects.toThrow("Luhn");
  });

  it("rejects an expired card", async () => {
    await expect(
      payByCard({
        reference: "AZL-2026-CARD03",
        method: "visa",
        cardNumber: "4242 4242 4242 4242",
        expiry: "01 / 20",
        cvc: "123",
        holder: "A. N'DIAYE",
      })
    ).rejects.toThrow("expirée");
  });

  it("rejects invalid expiry format", async () => {
    await expect(
      payByCard({
        reference: "AZL-2026-CARD04",
        method: "visa",
        cardNumber: "4242 4242 4242 4242",
        expiry: "invalid",
        cvc: "123",
        holder: "A. N'DIAYE",
      })
    ).rejects.toThrow("Expiration invalide");
  });

  it("rejects invalid CVC", async () => {
    await expect(
      payByCard({
        reference: "AZL-2026-CARD05",
        method: "visa",
        cardNumber: "4242 4242 4242 4242",
        expiry: "12 / 28",
        cvc: "12",
        holder: "A. N'DIAYE",
      })
    ).rejects.toThrow("Cryptogramme invalide");
  });

  it("rejects card starting with 0000", async () => {
    await expect(
      payByCard({
        reference: "AZL-2026-CARD06",
        method: "visa",
        cardNumber: "0000 0000 0000 0000",
        expiry: "12 / 28",
        cvc: "123",
        holder: "A. N'DIAYE",
      })
    ).rejects.toThrow("refusé le paiement");
  });

  it("rejects empty holder name", async () => {
    await expect(
      payByCard({
        reference: "AZL-2026-CARD07",
        method: "visa",
        cardNumber: "4242 4242 4242 4242",
        expiry: "12 / 28",
        cvc: "123",
        holder: "A",
      })
    ).rejects.toThrow("Nom du titulaire requis");
  });
});
