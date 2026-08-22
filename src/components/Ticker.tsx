import { ROOMS } from "../lib/data";
import { useClock } from "../lib/hooks";
import { abidjanTime } from "../lib/format";

export default function Ticker() {
  const now = useClock();
  const items = [
    `Réception — ${abidjanTime(now)} à Abidjan`,
    ...ROOMS.map((r) => `${r.name} — dès ${r.price.toLocaleString("fr-FR").replace(/\u202f/g, " ")} F / nuit`),
    "Petit-déjeuner 06 h 30 – 10 h 30 au Fromager",
    "Navette aéroport FHB — toutes les heures",
    "Salles de conférence — devis en 24 h",
    "Paiement Wave · Orange Money · MTN MoMo · Moov · Visa",
  ];
  const row = [...items, ...items];
  return (
    <div className="ticker hairline-b hairline-t overflow-hidden bg-night py-3" aria-hidden="true">
      <div className="ticker-track">
        {row.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center font-mono text-[11px] uppercase tracking-[0.22em] text-sand/60">
            <span className="mx-6 text-brass">✦</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
