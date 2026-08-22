import { Component, useEffect, useMemo, useRef, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import type { CatalogItem, Contact, PayMethod, Reservation } from "../lib/types";
import {
  addDaysIso,
  checkAvailability,
  computeQuote,
  createReservation,
  getItem,
  initiateMobilePayment,
  normalizePhone,
  payByCard,
  pollPaymentStatus,
  todayIso,
  validEmail,
} from "../lib/api";
import { CATALOG, METHODS } from "../lib/data";
import { fcfa, fmtDate, buildICS, downloadICS } from "../lib/format";
import { useBodyLock, useEscape, useScramble } from "../lib/hooks";
import { METHOD_LOGOS, IconCheck, IconClose, IconCopy, IconDownload, IconLock } from "./icons";
import { useToast } from "./ui";
import type { Prefill } from "./Hero";

type Step = 1 | 2 | 3 | 4;
type PayState = "idle" | "processing" | "error";

const MOBILE: PayMethod[] = ["wave", "orange", "mtn", "moov"];
const CARD: PayMethod[] = ["visa", "stripe"];

const STEPS: [Step, string][] = [
  [1, "Séjour"],
  [2, "Contact"],
  [3, "Paiement"],
  [4, "Confirmé"],
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function BookingInner({ prefill, onClose }: { prefill: Prefill; onClose: () => void }) {
  const toast = useToast();
  useBodyLock(true);
  useEscape(true, onClose);

  const [step, setStep] = useState<Step>(1);
  const [kind, setKind] = useState(prefill.kind);
  const [itemId, setItemId] = useState<string | null>(prefill.itemId ?? null);
  const [from, setFrom] = useState(prefill.from || todayIso());
  const [to, setTo] = useState(prefill.kind === "hall" ? prefill.from || todayIso() : prefill.to || addDaysIso(todayIso(), 2));
  const [guests, setGuests] = useState(prefill.guests);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);

  /* Jamais d'undefined dans le contact : une valeur de stockage corrompue
     ne doit jamais bloquer (ni faire crasher) la saisie. */
  const stored = useMemo<Contact>(() => {
    const sanitize = (raw: unknown): Contact => {
      const c = (raw ?? {}) as Partial<Contact>;
      return {
        name: typeof c.name === "string" ? c.name : "",
        email: typeof c.email === "string" ? c.email : "",
        phone: typeof c.phone === "string" ? c.phone : "",
      };
    };
    try {
      const raw = localStorage.getItem("azalai-contact");
      return sanitize(raw ? JSON.parse(raw) : null);
    } catch {
      return { name: "", email: "", phone: "" };
    }
  }, []);
  const [contact, setContact] = useState<Contact>(stored);

  const [method, setMethod] = useState<PayMethod | null>(null);
  const [payPhone, setPayPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payState, setPayState] = useState<PayState>("idle");
  const [payMsg, setPayMsg] = useState("");
  const [payError, setPayError] = useState("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const alive = useRef(true);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  /* Chaque étape commence en haut du panneau, jamais au milieu. */
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const items = CATALOG.filter((c) => c.kind === kind);
  const item: CatalogItem | null = itemId ? getItem(itemId) : null;
  const quote = useMemo(() => {
    const valid = item && from && to && (to > from || (to === from && kind === "hall"));
    if (!valid) return null;
    try {
      return computeQuote(item!, from, to);
    } catch {
      return null;
    }
  }, [item, from, to, kind]);

  const switchKind = (k: "room" | "hall") => {
    setKind(k);
    setItemId(null);
    setRemaining(null);
    if (k === "hall") setTo(from);
    else if (to <= from) setTo(addDaysIso(from, 1));
  };

  const setErr = (key: string, msg: string) => setErrors((e) => ({ ...e, [key]: msg }));
  const clearErr = (key: string) => setErrors((e) => ({ ...e, [key]: "" }));

  /* ——— Étape 1 → 2 ——— */
  const validateStep1 = async () => {
    setErrors({});
    if (!item) return setErr("item", "Choisissez une catégorie pour continuer.");
    if (!from) return setErr("from", "Date d'arrivée requise.");
    if (!to || to < from || (to === from && kind === "room")) return setErr("to", "Date de départ invalide.");
    if (guests > item.capacity) return setErr("guests", `Maximum ${item.capacity} personnes pour ${item.name}.`);
    setChecking(true);
    try {
      const res = await checkAvailability(item.id, from, to);
      if (!alive.current) return;
      if (res.remaining === 0) {
        setErrors({ dates: `Complet du ${fmtDate(from)} au ${fmtDate(to)}. Essayez d'autres dates — la réception peut aussi vous aider : +225 27 22 49 49 49.` });
      } else {
        setRemaining(res.remaining);
        setStep(2);
      }
    } catch (e) {
      if (alive.current) setErrors({ dates: e instanceof Error ? e.message : "Vérification impossible." });
    } finally {
      if (alive.current) setChecking(false);
    }
  };

  /* ——— Étape 2 → 3 ——— */
  const validateStep2 = () => {
    const name = (contact.name ?? "").trim();
    const email = (contact.email ?? "").trim();
    const phone = contact.phone ?? "";
    const e: Record<string, string> = {};
    if (name.length < 3) e.name = "Nom complet requis (3 caractères min.)";
    if (!validEmail(email)) e.email = "Adresse e-mail invalide — ex. awa@exemple.ci";
    if (!normalizePhone(phone)) e.phone = "10 chiffres attendus — ex. 07 08 09 10 11";
    setErrors(e);
    if (Object.keys(e).length) return;
    const clean: Contact = { name, email, phone };
    setContact(clean);
    try {
      localStorage.setItem("azalai-contact", JSON.stringify(clean));
    } catch { /* stockage indisponible — on continue quand même */ }
    setStep(3);
    toast("Coordonnées enregistrées.");
  };

  /* ——— Paiement ——— */
  const runPayment = async () => {
    if (!item || !quote || !method) return;
    setErrors({});
    if (MOBILE.includes(method)) {
      if (!normalizePhone(payPhone)) return setErr("pay", "Numéro Mobile Money invalide — 10 chiffres attendus.");
    } else {
      if (cardNumber.replace(/\D/g, "").length < 13) return setErr("pay", "Numéro de carte incomplet.");
    }
    setPayState("processing");
    setPayError("");
    try {
      setPayMsg("Chiffrement de la requête (TLS 1.3)…");
      await sleep(600);
      if (!alive.current) return;

      setPayMsg("Création de la réservation — verrouillage du stock…");
      const { reference, quote: officialQuote } = await createReservation({ kind, itemId: item.id, from, to, guests, contact });
      if (!alive.current) return;

      let transactionRef = "";
      if (MOBILE.includes(method)) {
        const op = METHODS.find((m) => m.id === method)?.name ?? "l'opérateur";
        setPayMsg(`Demande envoyée à ${op}…`);
        const init = await initiateMobilePayment({ reference, method, phone: payPhone });
        transactionRef = init.transactionRef;
        if (!alive.current) return;
        setPayMsg(init.message + " Code requis sur votre mobile.");
        let confirmed = false;
        while (!confirmed && alive.current) {
          const poll = await pollPaymentStatus(transactionRef);
          if (poll.status === "FAILED") throw Object.assign(new Error(poll.message), { code: "REJECTED" });
          if (poll.status === "CONFIRMED") confirmed = true;
        }
      } else {
        setPayMsg("Authentification 3-D Secure auprès de votre banque…");
        const res = await payByCard({ reference, method, cardNumber, expiry, cvc, holder });
        transactionRef = res.transactionRef;
      }

      if (!alive.current) return;
      const full: Reservation = {
        reference,
        kind,
        itemId: item.id,
        itemName: item.name,
        from,
        to,
        nights: officialQuote.nights,
        guests,
        contact,
        quote: officialQuote,
        method,
        transactionRef,
        createdAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem("azalai-last", JSON.stringify(full));
      } catch { /* ignore */ }
      setReservation(full);
      setPayState("idle");
      setStep(4);
      toast("Paiement confirmé — réservation enregistrée.");
    } catch (e) {
      if (!alive.current) return;
      setPayState("error");
      setPayError(e instanceof Error ? e.message : "Le paiement n'a pas abouti.");
    }
  };

  /* ——— Confirmation ——— */
  const scrambledRef = useScramble(reservation?.reference ?? "", step === 4);

  const copyRef = async () => {
    if (!reservation) return;
    try {
      await navigator.clipboard.writeText(reservation.reference);
      toast("Référence copiée dans le presse-papiers.");
    } catch {
      toast("Copie impossible — notez la référence manuellement.");
    }
  };

  const downloadReceipt = () => {
    if (!reservation) return;
    downloadICS(
      buildICS({
        title: `${reservation.kind === "room" ? "Séjour" : "Séminaire"} — ${reservation.itemName}`,
        from: reservation.from,
        to: reservation.to,
        ref: reservation.reference,
        location: "Résidence Azalaï, Boulevard Latrille, Cocody, Abidjan",
        description: `Référence ${reservation.reference} · ${reservation.guests} pers. · Total réglé ${fcfa(reservation.quote.total)} · Reçu ${reservation.transactionRef}`,
      }),
      `azalai-${reservation.reference}.ics`
    );
    toast("Reçu calendrier (.ics) téléchargé.");
  };

  const methodMeta = reservation ? METHODS.find((m) => m.id === reservation.method) : method ? METHODS.find((m) => m.id === method) : null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button aria-label="Fermer" onClick={onClose} className="fade-in absolute inset-0 w-full bg-night/80" />
      <aside className="drawer-in paper-scheme absolute inset-y-0 right-0 flex w-full max-w-[540px] flex-col bg-paper text-ink shadow-[-30px_0_80px_rgba(0,0,0,0.5)]">
        {/* entête */}
        <header className="hairline-b dark-line flex items-center justify-between px-6 py-4 md:px-8">
          <div>
            <div className="font-display text-xl italic">Réservation</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">Résidence Azalaï — Abidjan</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le panneau"
            className="flex h-10 w-10 items-center justify-center border border-ink/20 transition-colors hover:border-clay hover:text-clay"
          >
            <IconClose size={17} />
          </button>
        </header>

        {/* rail d'étapes */}
        <nav className="hairline-b dark-line flex px-6 md:px-8">
          {STEPS.map(([n, label]) => (
            <button
              key={n}
              onClick={() => n < step && setStep(n)}
              className={`relative flex-1 py-3.5 text-center font-mono text-[9px] uppercase tracking-[0.18em] transition-colors ${
                step === n ? "text-clay" : n < step ? "text-ink/60 hover:text-clay" : "text-ink/30"
              } ${n > 1 ? "border-l border-ink/10" : ""}`}
            >
              <span className="mr-1.5">{n < step ? "✓" : `0${n}`}</span>
              {label}
              <span className={`absolute inset-x-3 bottom-0 h-0.5 transition-all duration-500 ${step >= n ? "bg-clay" : "bg-transparent"}`} />
            </button>
          ))}
        </nav>

        {/* corps */}
        <div ref={bodyRef} className="slim-scroll relative flex-1 overflow-y-auto px-6 py-7 md:px-8">
          {step === 1 && (
            <div key="s1" className="step-in space-y-7">
              <div className="flex border border-ink/15">
                {(
                  [
                    ["room", "Séjour — chambres"],
                    ["hall", "Séminaire — salles"],
                  ] as ["room" | "hall", string][]
                ).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => switchKind(k)}
                    className={`flex-1 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      kind === k ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div>
                <FieldLabel>Choisissez {kind === "room" ? "votre chambre" : "votre salle"}</FieldLabel>
                <div className="slim-scroll -mx-1 mt-3 flex gap-3 overflow-x-auto pb-2">
                  {items.map((it) => (
                    <button
                      key={it.id}
                      onClick={() => {
                        setItemId(it.id);
                        setRemaining(null);
                        clearErr("item");
                        if (guests > it.capacity) setGuests(it.capacity);
                      }}
                      className={`group w-44 shrink-0 border text-left transition-all duration-300 ${
                        itemId === it.id ? "border-clay shadow-[0_8px_24px_rgba(14,33,26,0.12)]" : "border-ink/15 hover:border-ink/40"
                      }`}
                    >
                      <div className="relative h-24 overflow-hidden">
                        <img src={it.img} alt={it.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {itemId === it.id && (
                          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center bg-clay text-paper">
                            <IconCheck size={11} />
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="truncate font-display text-[15px] leading-tight">{it.name}</div>
                        <div className="mt-1 font-mono text-[10px] text-ink/55">
                          {fcfa(it.price)} / {it.unit}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <Err msg={errors.item} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Arrivée</FieldLabel>
                  <input type="date" value={from} min={todayIso()} onChange={(e) => { setFrom(e.target.value); setRemaining(null); }} className="field" />
                  <Err msg={errors.from} />
                </div>
                <div>
                  <FieldLabel>Départ</FieldLabel>
                  <input type="date" value={to} min={addDaysIso(from, 1)} onChange={(e) => { setTo(e.target.value); setRemaining(null); }} className="field" />
                  <Err msg={errors.to} />
                </div>
              </div>

              <div>
                <FieldLabel>{kind === "room" ? "Voyageurs" : "Participants"}</FieldLabel>
                <div className="mt-2 flex items-center gap-4">
                  <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="flex h-9 w-9 items-center justify-center border border-ink/20 font-mono transition-colors hover:border-clay hover:text-clay">−</button>
                  <span className="min-w-10 text-center font-display text-2xl">{guests}</span>
                  <button onClick={() => setGuests((g) => Math.min(item?.capacity ?? 8, g + 1))} className="flex h-9 w-9 items-center justify-center border border-ink/20 font-mono transition-colors hover:border-clay hover:text-clay">+</button>
                  {item && <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">max. {item.capacity}</span>}
                </div>
                <Err msg={errors.guests} />
              </div>

              <Err msg={errors.dates} />

              {remaining !== null && remaining > 0 && (
                <div className="fade-in flex items-center gap-3 border border-emerald-800/30 bg-emerald-800/10 px-4 py-3 text-sm text-emerald-900">
                  <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-700" />
                  {remaining === 1 ? "Dernière unité disponible sur ces dates" : `${remaining} unités disponibles sur ces dates`}
                </div>
              )}

              <button
                onClick={validateStep1}
                disabled={checking}
                className="group flex w-full items-center justify-center gap-3 bg-ink py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-paper transition-colors hover:bg-clay disabled:opacity-60"
              >
                {checking ? (
                  <>
                    Vérification
                    <span className="ldots flex gap-1"><span>·</span><span>·</span><span>·</span></span>
                  </>
                ) : (
                  <>
                    Vérifier la disponibilité
                    <IconArrowInline />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <form
              key="s2"
              className="step-in space-y-7"
              onSubmit={(e) => {
                e.preventDefault();
                validateStep2();
              }}
            >
              <p className="text-sm leading-relaxed text-ink/65">
                Ces coordonnées serviront pour la confirmation, la facture et toute correspondance de la réception.
              </p>
              <div>
                <FieldLabel>Nom complet</FieldLabel>
                <input
                  type="text"
                  autoFocus
                  autoComplete="name"
                  value={contact.name}
                  onChange={(e) => {
                    setContact({ ...contact, name: e.target.value });
                    if (errors.name) clearErr("name");
                  }}
                  placeholder="Awa N'Diaye"
                  className={`field ${errors.name ? "err" : ""}`}
                />
                <Err msg={errors.name} />
              </div>
              <div>
                <FieldLabel>Adresse e-mail</FieldLabel>
                <input
                  type="email"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(e) => {
                    setContact({ ...contact, email: e.target.value });
                    if (errors.email) clearErr("email");
                  }}
                  placeholder="awa@exemple.ci"
                  className={`field ${errors.email ? "err" : ""}`}
                />
                <Err msg={errors.email} />
              </div>
              <div>
                <FieldLabel>Téléphone (WhatsApp bienvenu)</FieldLabel>
                <div className="flex gap-3">
                  <span className="field pointer-events-none w-20 shrink-0 text-center text-ink/50">+225</span>
                  <input
                    type="tel"
                    autoComplete="tel-national"
                    value={contact.phone}
                    onChange={(e) => {
                      setContact({ ...contact, phone: e.target.value });
                      if (errors.phone) clearErr("phone");
                    }}
                    placeholder="07 08 09 10 11"
                    inputMode="tel"
                    className={`field ${errors.phone ? "err" : ""}`}
                  />
                </div>
                <Err msg={errors.phone} />
                <p className="mt-2 text-xs text-ink/45">10 chiffres, sans le préfixe +225.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <BackBtn onClick={() => setStep(1)} />
                <button
                  type="submit"
                  className="group flex flex-1 items-center justify-center gap-3 bg-ink py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-paper transition-colors hover:bg-clay"
                >
                  Vers le paiement <IconArrowInline />
                </button>
              </div>
            </form>
          )}

          {step === 3 && item && quote && (
            <div key="s3" className="step-in space-y-7">
              {/* récapitulatif */}
              <div className="border border-ink/12 bg-parch p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl">{item.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">{kind === "room" ? "Séjour" : "Séminaire"}</span>
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
                  {fmtDate(from)} → {fmtDate(to)} · {quote.nights} {quote.nights > 1 ? (kind === "room" ? "nuits" : "jours") : kind === "room" ? "nuit" : "jour"} · {guests} pers.
                </div>
                <dl className="mt-4 space-y-1.5 border-t border-ink/10 pt-4 text-sm">
                  <Row k={`Tarif × ${quote.nights}`} v={fcfa(quote.base)} />
                  <Row k="TVA 18 %" v={fcfa(quote.vat)} />
                  <Row k="Service 7 %" v={fcfa(quote.service)} />
                  <div className="flex justify-between border-t border-ink/10 pt-2 font-display text-lg">
                    <dt>Total à régler</dt>
                    <dd className="text-clay">{fcfa(quote.total)}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <FieldLabel>Moyen de paiement</FieldLabel>
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {METHODS.map((m) => {
                    const Logo = METHOD_LOGOS[m.id];
                    const active = method === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setMethod(m.id);
                          setPayError("");
                          clearErr("pay");
                        }}
                        className={`flex flex-col items-start gap-2 border p-3.5 text-left transition-all duration-300 ${
                          active ? "border-clay bg-white/60 shadow-[0_6px_20px_rgba(14,33,26,0.1)]" : "border-ink/15 hover:border-ink/40"
                        }`}
                      >
                        <Logo size={20} />
                        <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.1em]">{m.name}</span>
                        {active && <IconCheck size={12} className="text-clay" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {method && MOBILE.includes(method) && (
                <div className="fade-in">
                  <FieldLabel>Numéro {methodMeta?.name}</FieldLabel>
                  <div className="flex gap-3">
                    <span className="field pointer-events-none w-20 shrink-0 text-center text-ink/50">+225</span>
                    <input
                      value={payPhone}
                      onChange={(e) => setPayPhone(e.target.value)}
                      placeholder="07 08 09 10 11"
                      inputMode="tel"
                      className={`field ${errors.pay ? "err" : ""}`}
                    />
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-ink/55">
                    Une demande de paiement sera poussée sur ce téléphone. Validez-la avec votre code secret
                    {method === "orange" ? " (composez #144# si rien n'apparaît)" : ""} — la résidence ne voit jamais votre solde.
                  </p>
                  <Err msg={errors.pay} />
                </div>
              )}

              {method && CARD.includes(method) && (
                <div className="fade-in space-y-5">
                  <div>
                    <FieldLabel>Numéro de carte</FieldLabel>
                    <input
                      value={cardNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 19);
                        setCardNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
                      }}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      className={`field font-mono ${errors.pay ? "err" : ""}`}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <FieldLabel>Expire</FieldLabel>
                      <input
                        value={expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2) v = v.slice(0, 2) + " / " + v.slice(2);
                          setExpiry(v);
                        }}
                        placeholder="MM / AA"
                        inputMode="numeric"
                        className="field font-mono"
                      />
                    </div>
                    <div>
                      <FieldLabel>CVC</FieldLabel>
                      <input value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" inputMode="numeric" className="field font-mono" />
                    </div>
                    <div>
                      <FieldLabel>Titulaire</FieldLabel>
                      <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="A. N'DIAYE" className="field uppercase" />
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-ink/55">
                    <IconLock size={13} className="text-clay" /> Saisie chiffrée Stripe — le numéro ne transite jamais par nos serveurs.
                  </p>
                  <Err msg={errors.pay} />
                </div>
              )}

              {payState === "processing" && (
                <div className="fade-in flex items-center gap-4 border border-ink/12 bg-white/50 px-5 py-4">
                  <span className="ldots flex gap-1 text-clay text-xl"><span>·</span><span>·</span><span>·</span></span>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">Transaction en cours</div>
                    <div className="mt-1 text-sm text-ink/75">{payMsg}</div>
                  </div>
                </div>
              )}

              {payState === "error" && (
                <div className="fade-in border border-red-900/30 bg-red-900/10 px-5 py-4 text-sm leading-relaxed text-red-950">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-800">Paiement refusé</span>
                  <p className="mt-1.5">{payError}</p>
                  <p className="mt-1.5 text-xs text-red-900/70">Aucune somme n'a été débitée. Vous pouvez réessayer ou changer de moyen de paiement.</p>
                </div>
              )}

              <div className="flex gap-3">
                <BackBtn onClick={() => (payState === "idle" ? setStep(2) : undefined)} disabled={payState === "processing"} />
                <button
                  onClick={runPayment}
                  disabled={!method || payState === "processing"}
                  className="group flex flex-1 items-center justify-center gap-3 bg-clay py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-all hover:bg-ink disabled:opacity-50"
                >
                  {payState === "processing" ? "Traitement sécurisé…" : method ? `Payer ${fcfa(quote.total)}` : "Choisir un moyen"}
                  {payState !== "processing" && <IconLock size={14} />}
                </button>
              </div>
            </div>
          )}

          {step === 4 && reservation && (
            <div key="s4" className="step-in space-y-7 text-center">
              <div className="ring-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-800/50 bg-emerald-800/10">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path className="draw-check" d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-3xl font-light">C'est confirmé.</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/65">
                  Un e-mail de confirmation et le reçu viennent de partir vers{" "}
                  <span className="font-medium text-ink">{reservation.contact.email}</span>.
                  Présentez votre référence à la réception.
                </p>
              </div>

              <div className="border border-ink/12 bg-parch px-6 py-5 text-left">
                <div className="text-center">
                  <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">Référence de réservation</div>
                  <div className="mt-1 font-mono text-2xl tracking-[0.08em] text-clay">{scrambledRef}</div>
                </div>
                <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
                  <Row k="Hébergement" v={reservation.itemName} />
                  <Row k="Arrivée" v={fmtDate(reservation.from)} />
                  <Row k="Départ" v={fmtDate(reservation.to)} />
                  <Row k={reservation.kind === "room" ? "Nuits" : "Jours"} v={String(reservation.nights)} />
                  <Row k={reservation.kind === "room" ? "Voyageurs" : "Participants"} v={String(reservation.guests)} />
                  <Row k="Au nom de" v={reservation.contact.name} />
                  <Row k="Payé via" v={`${methodMeta?.name ?? reservation.method} · ${reservation.transactionRef}`} />
                  <div className="flex justify-between border-t border-ink/10 pt-2.5 font-display text-lg">
                    <dt>Total réglé</dt>
                    <dd className="text-emerald-900">{fcfa(reservation.quote.total)}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={downloadReceipt} className="flex flex-1 items-center justify-center gap-2.5 border border-ink/25 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-clay hover:text-clay">
                  <IconDownload size={15} /> Reçu (.ics)
                </button>
                <button onClick={copyRef} className="flex flex-1 items-center justify-center gap-2.5 border border-ink/25 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-clay hover:text-clay">
                  <IconCopy size={15} /> Copier la référence
                </button>
              </div>
              <button onClick={onClose} className="w-full bg-ink py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-paper transition-colors hover:bg-clay">
                Fermer — à très vite à Abidjan
              </button>
            </div>
          )}
        </div>

        {/* barre total */}
        {step < 4 && (
          <footer className="hairline-t dark-line flex items-center justify-between gap-4 bg-parch px-6 py-4 md:px-8">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/45">
                {item ? item.name : "Sélection en cours"}
              </div>
              <div className="font-display text-xl text-ink">
                {quote ? fcfa(quote.total) : "— F"}
                {quote && <span className="font-mono text-[10px] text-ink/45"> TTC · {quote.nights} {kind === "room" ? "nuit" : "jour"}{quote.nights > 1 ? "s" : ""}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">
              <IconLock size={12} className="text-clay" /> Paiement chiffré
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}

/* Filet de sécurité : même en cas d'erreur interne, le panneau ne reste
   jamais vide — l'utilisateur voit un message et peut réessayer. */
class DrawerBoundary extends Component<
  { children: ReactNode; onClose: () => void },
  { error: string | null }
> {
  state = { error: null as string | null };
  static getDerivedStateFromError(err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur interne inattendue" };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Azalaï — réservation]", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="fade-in fixed inset-0 z-[70] flex items-center justify-center bg-night/85 p-6">
          <div className="w-full max-w-md border border-brass/40 bg-paper p-8 text-ink shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-clay">Résidence Azalaï — assistance</div>
            <h3 className="mt-3 font-display text-2xl font-light">Le panneau a rencontré un imprévu.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Rien de grave : vos dates ne sont pas perdues. Réessayez, et si le problème
              persiste, la réception vous réserve par téléphone au{" "}
              <span className="font-medium text-ink">+225 27 22 49 49 49</span>.
            </p>
            <p className="mt-3 border border-ink/10 bg-parch px-3 py-2 font-mono text-[11px] text-ink/55">
              Détail : {this.state.error}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => this.setState({ error: null })}
                className="flex-1 bg-ink py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-paper transition-colors hover:bg-clay"
              >
                Réessayer
              </button>
              <button
                onClick={this.props.onClose}
                className="border border-ink/25 px-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60 transition-colors hover:border-ink hover:text-ink"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Booking({ prefill, onClose }: { prefill: Prefill; onClose: () => void }) {
  return (
    <DrawerBoundary onClose={onClose}>
      <BookingInner prefill={prefill} onClose={onClose} />
    </DrawerBoundary>
  );
}

/* ——— petits blocs internes ——— */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">{children}</span>;
}
function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="fade-in mt-2 text-xs font-medium text-red-800">▲ {msg}</p>;
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/55">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
function BackBtn({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="border border-ink/20 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
    >
      ←
    </button>
  );
}
function IconArrowInline() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform duration-300 group-hover:translate-x-1.5">
      <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
