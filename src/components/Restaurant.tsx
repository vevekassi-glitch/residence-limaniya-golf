import { IMAGES } from "../lib/data";
import { Reveal, SectionHead, BrassButton } from "./ui";
import { IconClock, IconLeaf } from "./icons";
import type { Prefill } from "./Hero";

const MEALS = [
  {
    time: "Petit-déjeuner",
    hours: "06 h 30 – 10 h 30",
    desc: "Buffet africain et continental : fruits de la lagune, pain maison, jus de fruits pressés, café Robusta du Haut-N'Daka. Le Fromager ouvre avec le soleil.",
    tags: ["Buffet inclus", "Vue piscine"],
  },
  {
    time: "Déjeuner",
    hours: "12 h 00 – 14 h 30",
    desc: "Carte du jour signée par le chef — poisson braisé à la banana, attiéké, alloco, et les classiques de la table ivoirienne. Terrasse bord de l'eau.",
    tags: ["À la carte", "Terrasse lagune"],
  },
  {
    time: "Dîner",
    hours: "19 h 00 – 22 h 30",
    desc: "Ambiance bougeoirs, musique live le vendredi. Filet de capitaine sauce graine, côte de bœuf au poivre vert, et la carte des vins d'Afrique de l'Ouest.",
    tags: ["Réservation conseillée", "Musique live ven."],
  },
];

const SPECIALTIES = [
  "Poisson braisé à la banana",
  "Attieké garni aux crevettes",
  "Alloco poisson frit",
  "Sauce graine de capitaine",
  "Côte de bœuf au poivre vert",
  "Salade de mangue verte",
];

export default function Restaurant({ onBook }: { onBook: (p: Prefill) => void }) {
  return (
    <section id="restaurant" className="relative overflow-hidden bg-night py-24 md:py-36">
      {/* halos */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-clay/10 blur-[140px]" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-[400px] w-[400px] rounded-full bg-brass/8 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        {/* colonne image */}
        <Reveal>
          <div className="relative">
            <div className="imgkb aspect-[4/5] overflow-hidden">
              <img
                src={IMAGES.restaurant}
                alt="Le Fromager — restaurant de la Résidence Limaniya Golf, vue sur la piscine et les jardins"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            {/* carte flottante */}
            <div className="absolute -bottom-8 -right-4 border border-sand/20 bg-pine/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm lg:-right-12">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-brass">Horaires</div>
              <div className="mt-2 space-y-1.5">
                {MEALS.map((m) => (
                  <div key={m.time} className="flex items-center gap-3 text-sm text-sand/80">
                    <IconClock size={13} className="text-brass" />
                    <span className="font-medium text-sand">{m.time}</span>
                    <span className="font-mono text-[10px] text-sand/50">{m.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* badge */}
            <span className="absolute left-4 top-4 border border-sand/25 bg-night/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-sand/85">
              Le Fromager
            </span>
          </div>
        </Reveal>

        {/* colonne contenu */}
        <div className="lg:py-8">
          <SectionHead
            index="03"
            kicker="Restaurant"
            dark
            title={
              <>
                Le <em className="text-brassl">Fromager.</em>
              </>
            }
          >
            <p>
              La table de la résidence, les pieds dans l'eau. Le Fromager sert la cuisine
              ivoirienne dans un cadre de marbre vert et de laiton — du petit-déjeuner
              au dîner aux bougies, chaque repas est un moment.
            </p>
          </SectionHead>

          {/* service cards */}
          <div className="space-y-5">
            {MEALS.map((m, i) => (
              <Reveal key={m.time} delay={i * 90}>
                <div className="group border border-sand/12 p-5 transition-all duration-500 hover:border-brass/35 hover:bg-pine/40">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-display text-xl text-sand">{m.time}</h4>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">{m.hours}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-mist/80">{m.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-brass/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-brass/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* spécialités */}
          <Reveal delay={300}>
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <IconLeaf size={16} className="text-brass" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">Les incontournables</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {SPECIALTIES.map((s) => (
                  <span key={s} className="flex items-center gap-2.5 text-sm text-sand/70">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-brass" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={350} className="mt-10">
            <BrassButton onClick={() => onBook({ kind: "room", from: "", to: "", guests: 2 })}>
              Réserver une table
            </BrassButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
