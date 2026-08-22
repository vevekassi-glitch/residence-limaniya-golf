import { useEffect, useState } from "react";
import { IMAGES } from "../lib/data";
import { addDaysIso, todayIso } from "../lib/api";
import type { ItemKind } from "../lib/types";
import { IconUsers } from "./icons";

export interface Prefill {
  kind: ItemKind;
  from: string;
  to: string;
  guests: number;
  itemId?: string;
}

export default function Hero({ onBook }: { onBook: (p: Prefill) => void }) {
  const [ready, setReady] = useState(false);
  const [kind, setKind] = useState<ItemKind>("room");
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(addDaysIso(todayIso(), 2));
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const set = (v: number) => setGuests(Math.min(8, Math.max(1, v)));

  return (
    <section className={`relative min-h-[100svh] overflow-hidden ${ready ? "hero-in" : ""}`}>
      {/* image + voile */}
      <div className="absolute inset-0">
        <img src={IMAGES.hero} alt="La Résidence Azalaï au crépuscule, jardins et piscine" className="kenburns h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/55 to-night/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/40" />
      </div>

      {/* coordonnées verticales */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[10px] uppercase tracking-[0.5em] text-sand/45 [writing-mode:vertical-rl] lg:block">
        5°21′N — 4°01′O · Cocody, Abidjan
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-[390px] pt-32 md:px-8 md:pb-40">
        <div className="max-w-4xl">
          <p className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.35em] text-brass">
            <span className="h-px w-12 bg-brass/60" />
            Résidence hôtelière — depuis 1987
          </p>
          <h1 className="font-display text-[clamp(2.9rem,8.5vw,7rem)] font-light leading-[0.98] tracking-tight text-sand">
            <span className="mline"><span style={{ transitionDelay: "100ms" }}>La résidence</span></span>
            <span className="mline"><span style={{ transitionDelay: "240ms" }}>des grands</span></span>
            <span className="mline"><span style={{ transitionDelay: "380ms" }} className="italic text-brassl">séjours<span className="text-brass">.</span></span></span>
          </h1>
          <div className="mline mt-8 max-w-md">
            <p style={{ transitionDelay: "560ms" }} className="text-[15px] leading-relaxed text-mist">
              Quarante-huit chambres sur la lagune Ébrié, trois salles pour vos séminaires,
              et six façons de payer — de Wave à Visa, sans quitter votre téléphone.
            </p>
          </div>
        </div>
      </div>

      {/* indice de scroll */}
      <div className="absolute bottom-40 left-1/2 hidden -translate-x-1/2 md:block lg:left-auto lg:right-16 lg:translate-x-0">
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-sand/50">Défiler</span>
          <span className="h-14 w-px overflow-hidden bg-sand/15">
            <span className="cue-line block h-full w-full bg-brass" />
          </span>
        </div>
      </div>

      {/* ——— Barre de réservation : l'instrument ——— */}
      <div className="absolute inset-x-0 bottom-0 border-t border-sand/10 bg-pine/95 backdrop-blur-[2px]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-sand/10 md:grid-cols-[auto_1fr_1fr_auto_auto] md:items-stretch">
          <div className="flex items-center bg-pine px-5 py-4 md:py-0">
            <div className="flex border border-sand/15">
              {(
                [
                  ["room", "Séjour"],
                  ["hall", "Salle"],
                ] as [ItemKind, string][]
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    kind === k ? "bg-brass text-night" : "text-sand/60 hover:text-sand"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="group flex flex-col justify-center gap-1 bg-pine px-5 py-3.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brass">Arrivée</span>
            <input
              type="date"
              value={from}
              min={todayIso()}
              onChange={(e) => {
                setFrom(e.target.value);
                if (e.target.value >= to) setTo(addDaysIso(e.target.value, 1));
              }}
              className="bg-transparent font-body text-sm text-sand outline-none"
            />
          </label>

          <label className="group flex flex-col justify-center gap-1 bg-pine px-5 py-3.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brass">Départ</span>
            <input
              type="date"
              value={to}
              min={addDaysIso(from, 1)}
              onChange={(e) => setTo(e.target.value)}
              className="bg-transparent font-body text-sm text-sand outline-none"
            />
          </label>

          <div className="flex items-center justify-between gap-4 bg-pine px-5 py-3.5 md:justify-start">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brass">Voyageurs</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => set(guests - 1)}
                className="flex h-7 w-7 items-center justify-center border border-sand/20 font-mono text-sm text-sand transition-colors hover:border-brass hover:text-brass"
                aria-label="Moins de voyageurs"
              >
                −
              </button>
              <span className="flex min-w-8 items-center justify-center gap-1.5 font-body text-sm text-sand">
                <IconUsers size={14} className="text-sand/50" />
                {guests}
              </span>
              <button
                onClick={() => set(guests + 1)}
                className="flex h-7 w-7 items-center justify-center border border-sand/20 font-mono text-sm text-sand transition-colors hover:border-brass hover:text-brass"
                aria-label="Plus de voyageurs"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => onBook({ kind, from, to, guests })}
            className="group flex items-center justify-center gap-3 bg-brass px-8 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-brassl md:py-0"
          >
            Vérifier
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform duration-300 group-hover:translate-x-1.5">
              <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
