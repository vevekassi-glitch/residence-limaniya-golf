import { useState } from "react";
import { useToast } from "./ui";
import { IconArrowUp, IconPin, IconClock, IconPhone } from "./icons";
import { METHOD_LOGOS } from "./icons";

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const subscribe = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast("Adresse e-mail invalide — vérifiez la saisie.");
      return;
    }
    setEmail("");
    toast("Bienvenue au Cercle Azalaï. Premier courriel le mois prochain.");
  };

  return (
    <footer className="hairline-t relative overflow-hidden bg-night">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-[clamp(3rem,7vw,5.5rem)] font-light italic leading-none text-sand">
              Azala<span className="text-brass">ï</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist/80">
              Résidence hôtelière à Cocody, Abidjan. Chambres et suites sur la lagune,
              trois salles de conférence, une table, un jardin — et six façons de payer.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {(["wave", "orange", "mtn", "moov", "visa", "stripe"] as const).map((m) => {
                const Logo = METHOD_LOGOS[m];
                return (
                  <span key={m} className="opacity-70 transition-all duration-300 hover:-translate-y-1 hover:opacity-100">
                    <Logo size={18} />
                  </span>
                );
              })}
            </div>

          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">La réception</div>
              <ul className="mt-5 space-y-3.5 text-sm text-sand/75">
                <li className="flex items-start gap-3"><IconPin size={15} className="mt-0.5 shrink-0 text-brass" /> Boulevard Latrille, Deux-Plateaux, Cocody — Abidjan</li>
                <li className="flex items-center gap-3"><IconPhone size={15} className="shrink-0 text-brass" /> +225 27 22 49 49 49</li>
                <li className="flex items-center gap-3"><IconClock size={15} className="shrink-0 text-brass" /> Conciergerie 24 h/24, 7 j/7</li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Plan du site</div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {[
                  ["#maison", "La maison"],
                  ["#chambres", "Chambres & suites"],
                  ["#salles", "Salles & séminaires"],
                  ["#paiement", "Paiement"],
                  ["#avis", "Livre d'or"],
                  ["#faq", "Questions"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="group inline-flex items-center gap-2 text-sand/70 transition-colors hover:text-brass">
                      <span className="h-px w-3 bg-brass/40 transition-all group-hover:w-5 group-hover:bg-brass" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Le Cercle Azalaï</div>
            <p className="mt-5 text-sm leading-relaxed text-sand/70">
              Une lettre par mois : offres de saison, dates de séminaires et nuits à tarif Cercle.
            </p>
            <div className="mt-5 flex border border-sand/20 focus-within:border-brass">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                placeholder="votre@email.ci"
                className="w-full bg-transparent px-4 py-3 text-sm text-sand outline-none placeholder:text-sand/35"
              />
              <button
                onClick={subscribe}
                className="bg-brass px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-night transition-colors hover:bg-brassl"
              >
                OK
              </button>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-sand/50 transition-colors hover:text-brass"
            >
              <span className="flex h-10 w-10 items-center justify-center border border-sand/20 transition-colors group-hover:border-brass">
                <IconArrowUp size={15} className="transition-transform duration-300 group-hover:-translate-y-1" />
              </span>
              Remonter à la réception
            </button>
          </div>
        </div>

        <div className="hairline-t mt-16 flex flex-wrap items-center justify-between gap-4 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-sand/40">
          <span>© 2026 Résidence Azalaï — Abidjan, Côte d'Ivoire</span>
          <span className="flex items-center gap-2">
            <svg width="11" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brass/60">
              <rect x="4" y="10" width="16" height="11" rx="1.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            Paiements chiffrés — aucune donnée carte stockée
          </span>
          <span>RCCM CI-ABJ-2026-B-01847 · Agrément tourisme n° 00412</span>
        </div>
      </div>
    </footer>
  );
}
