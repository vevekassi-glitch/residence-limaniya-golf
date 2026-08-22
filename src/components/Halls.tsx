import { HALLS } from "../lib/data";
import type { CatalogItem } from "../lib/types";
import { fcfa } from "../lib/format";
import { BrassButton, Reveal, SectionHead } from "./ui";
import { IconScreen, IconUsers, IconWifi, IconResto, IconArrow } from "./icons";
import type { Prefill } from "./Hero";
import { todayIso } from "../lib/api";

export default function Halls({ onBook }: { onBook: (p: Prefill) => void }) {
  return (
    <section id="salles" className="relative overflow-hidden bg-pine py-24 md:py-36">
      <div className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px] rounded-full bg-brass/8 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="03"
          kicker="Salles & séminaires"
          dark
          title={
            <>
              Vos séminaires,<br />
              notre <em className="text-brassl">scène.</em>
            </>
          }
        >
          <p>
            Trois espaces modulables, une régie professionnelle et un coordinateur dédié du devis à la facture.
            Pauses café, déjeuners au Fromager et blocs de chambres : tout s'ajoute d'un clic au devis.
          </p>
        </SectionHead>

        <div className="hairline-t">
          {HALLS.map((hall, i) => (
            <HallBand key={hall.id} hall={hall} index={i} onBook={onBook} />
          ))}
        </div>

        <Reveal className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 font-mono text-[11px] uppercase tracking-[0.2em] text-sand/50">
          <span className="flex items-center gap-2.5"><IconScreen size={16} className="text-brass" /> Régie & projection incluses</span>
          <span className="flex items-center gap-2.5"><IconWifi size={16} className="text-brass" /> Fibre dédiée 1 Gb/s</span>
          <span className="flex items-center gap-2.5"><IconResto size={16} className="text-brass" /> Pauses & déjeuners sur place</span>
          <span className="flex items-center gap-2.5"><IconUsers size={16} className="text-brass" /> Devis séminaire résidentiel en 24 h</span>
        </Reveal>
      </div>
    </section>
  );
}

function HallBand({ hall, index, onBook }: { hall: CatalogItem; index: number; onBook: (p: Prefill) => void }) {
  return (
    <Reveal className="hairline-b">
      <article className="group grid gap-8 py-10 transition-colors duration-500 hover:bg-moss/40 lg:grid-cols-[280px_1fr_auto] lg:items-center lg:gap-12 lg:px-6">
        <div className="imgkb relative aspect-[16/10] overflow-hidden lg:aspect-[4/3]">
          <img
            src={hall.img}
            alt={hall.name}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ objectPosition: `${index * 30}% center` }}
          />
          <span className="absolute bottom-3 left-3 bg-night/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-brass">
            Salle 0{index + 1}
          </span>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h3 className="font-display text-2xl font-light text-sand md:text-3xl">{hall.name}</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sand/45">{hall.size} m² · {hall.tagline}</span>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist/85">{hall.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {hall.configs?.map((c) => (
              <span
                key={c.label}
                className="border border-brass/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-brass transition-colors duration-300 group-hover:border-brass/60"
              >
                {c.label} · {c.value} pers.
              </span>
            ))}
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] text-sand/60">
            {hall.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brass" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-5">
          <div className="lg:text-right">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sand/45">Journée</span>
            <div className="font-display text-2xl text-sand md:text-3xl">{fcfa(hall.price)}</div>
          </div>
          <BrassButton
            onClick={() => onBook({ kind: "hall", itemId: hall.id, from: todayIso(), to: todayIso(), guests: 10 })}
            className="lg:px-5"
          >
            Réserver la salle
          </BrassButton>
          <IconArrow size={20} className="hidden text-brass opacity-0 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100 lg:block" />
        </div>
      </article>
    </Reveal>
  );
}
