import { ROOMS } from "../lib/data";
import type { CatalogItem } from "../lib/types";
import { fcfa } from "../lib/format";
import { BrassButton, Reveal, SectionHead } from "./ui";
import { IconBed, IconRuler, IconUsers, IconCheck } from "./icons";
import type { Prefill } from "./Hero";
import { todayIso } from "../lib/api";
import SuiteDetail from "./SuiteDetail";

export default function Rooms({ onBook }: { onBook: (p: Prefill) => void }) {
  return (
    <section id="chambres" className="paper relative bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            index="02"
            kicker="Chambres & suites"
            title={
              <>
                Quarante-huit façons<br />
                de <em className="text-clay">bien dormir.</em>
              </>
            }
          >
            <p>
              Quatre catégories, une même exigence : lin lavé, matelas fabriqués pour la résidence,
              et le noir complet des rideaux occultants. Tarifs par nuit, petit-déjeuner au Fromager inclus.
            </p>
          </SectionHead>
          <Reveal className="mb-14 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ink/45 md:block md:mb-20">
            Taxes calculées au paiement<br />TVA 18 % · service 7 %
          </Reveal>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {ROOMS.map((room, i) =>
            room.gallery ? (
              <SuiteDetail key={room.id} room={room} onBook={onBook} />
            ) : (
              <RoomRow key={room.id} room={room} index={i} flip={i % 2 === 1} onBook={onBook} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function RoomRow({ room, index, flip, onBook }: { room: CatalogItem; index: number; flip: boolean; onBook: (p: Prefill) => void }) {
  return (
    <article className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${flip ? "lg:[direction:rtl]" : ""}`}>
      <Reveal className="[direction:ltr]">
        <div className={`imgkb relative ${room.badge ? "" : ""} aspect-[4/3]`}>
          <img src={room.img} alt={`${room.name} — ${room.tagline}`} loading="lazy" className="h-full w-full object-cover" />
          {room.badge && (
            <span className="absolute right-4 top-4 bg-clay px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.28em] text-paper">
              {room.badge}
            </span>
          )}
          <span className="absolute bottom-4 left-4 border border-paper/30 bg-night/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-sand">
            N° 0{index + 1} / 04
          </span>
        </div>
      </Reveal>

      <Reveal delay={120} className="[direction:ltr]">
        <div className="flex items-baseline gap-4">
          <h3 className="font-display text-3xl font-light tracking-tight md:text-[2.6rem]">{room.name}</h3>
          <span className="hidden h-px flex-1 bg-ink/15 sm:block" />
        </div>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-clay">{room.tagline}</p>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70">{room.description}</p>

        <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60">
          <span className="flex items-center gap-2"><IconUsers size={15} className="text-clay" /> {room.capacity} pers.</span>
          <span className="flex items-center gap-2"><IconRuler size={15} className="text-clay" /> {room.size} m²</span>
          <span className="flex items-center gap-2"><IconBed size={15} className="text-clay" /> {room.beds}</span>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {room.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-ink/75">
              <IconCheck size={13} className="shrink-0 text-clay" /> {f}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-ink/10 pt-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/45">À partir de</span>
            <div className="font-display text-3xl text-ink">
              {fcfa(room.price)}
              <span className="font-mono text-xs text-ink/50"> / {room.unit}</span>
            </div>
          </div>
          <BrassButton dark={false} onClick={() => onBook({ kind: "room", itemId: room.id, from: todayIso(), to: "", guests: 2 })}>
            Réserver
          </BrassButton>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-700" />
            {room.stock} unités
          </span>
        </div>
      </Reveal>
    </article>
  );
}
