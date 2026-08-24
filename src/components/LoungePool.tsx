import { Reveal, SectionHead } from "./ui";
import { IconPool, IconSpa, IconSun, IconResto } from "./icons";
import type { Prefill } from "./Hero";

const EXPERIENCES = [
  {
    icon: IconPool,
    title: "La Piscine Infinity",
    desc: "Bordée de teck et de végétation tropicale, la piscine à débordement donne sur la lagune Ébrié. 18 mètres de long, chauffée, et ouverte de 6h à 22h.",
    details: ["18 m × 8 m", "Chauffée 28°C", "Vue lagune"],
  },
  {
    icon: IconSun,
    title: "Le Solarium",
    desc: "Trente transats en aluminium et lin, parasols moresque, vue directe sur le parcours de golf. Le meilleur endroit pour une sieste après le déjeuner.",
    details: ["30 transats", "Service piscine", "Vue golf"],
  },
  {
    icon: IconResto,
    title: "Le Pool Bar",
    desc: "Cocktails.signature, jus de fruits pressés, glaces artisanales et tapas légers — le service arrive avant que vous ne demandiez. Boba et champagne inclus.",
    details: ["Cocktails craft", "Tapas & glaces", "Service en bassine"],
  },
  {
    icon: IconSpa,
    title: "Le Spa & Hammam",
    desc: "Douze soins signés, hammam traditionnel et salle de relaxation. Les soins du visage au beurre de karité du Nord et les massages aux huiles de ylang-ylang.",
    details: ["12 soins", "Hammam", "Salle relax"],
  },
];

export default function LoungePool() {
  return (
    <section id="lounge" className="relative overflow-hidden bg-pine py-24 md:py-36">
      {/* halos */}
      <div className="pointer-events-none absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-fern/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-[400px] w-[400px] rounded-full bg-brass/8 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="04"
          kicker="Lounge & Détente"
          dark
          title={
            <>
              Soufflez.<br />
              <em className="text-brassl">L'eau vous attend.</em>
            </>
          }
        >
          <p>
            De la piscine infinity au spa en passant par le pool bar, chaque espace est pensé
            pour que vous débranchiez. L'horizon lagune fait le reste.
          </p>
        </SectionHead>

        {/* grille expériences */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.title} delay={i * 90}>
              <div className="group flex h-full flex-col border border-sand/12 bg-night/40 p-6 transition-all duration-500 hover:border-brass/40 hover:bg-night/60">
                <span className="mb-5 text-brass transition-transform duration-300 group-hover:-translate-y-1">
                  <exp.icon size={24} />
                </span>
                <h4 className="font-display text-xl text-sand">{exp.title}</h4>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mist/80">{exp.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-sand/10 pt-3">
                  {exp.details.map((d) => (
                    <span
                      key={d}
                      className="border border-brass/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-brass/80"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* barre cocktail */}
        <Reveal delay={350}>
          <div className="mt-12 border border-sand/15 bg-night/50 p-6 md:p-8">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Le Pool Bar — Carte du moment</div>
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
                  {[
                    ["Sunset Spritz", "Orange · prosecco · angostura"],
                    ["Lagune Mojito", "Menthe fraîche · rhum · citron vert"],
                    ["Afro Colada", "Coco · ananas · rhum blanc"],
                    ["Fruité de la Résidence", "Mangue · passion · gingembre"],
                    ["Champagne Rosé", "Domaine — flute servie au bord"],
                    ["Jus Pressé Maison", "Goyave · bouye · citron"],
                  ].map(([name, desc]) => (
                    <div key={name}>
                      <div className="text-sm font-medium text-sand">{name}</div>
                      <div className="font-mono text-[10px] text-sand/50">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-l border-sand/15 pl-8 text-center">
                <div className="font-display text-3xl italic text-brassl">Pool</div>
                <div className="font-display text-2xl text-sand">Bar</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sand/50">10h – 22h</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* horaires spa */}
        <Reveal delay={400} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 font-mono text-[11px] uppercase tracking-[0.2em] text-sand/50">
          <span className="flex items-center gap-2.5"><IconPool size={16} className="text-brass" /> Piscine 6h – 22h</span>
          <span className="flex items-center gap-2.5"><IconSpa size={16} className="text-brass" /> Spa 9h – 20h</span>
          <span className="flex items-center gap-2.5"><IconSun size={16} className="text-brass" /> Solarium 7h – 19h</span>
          <span className="flex items-center gap-2.5"><IconResto size={16} className="text-brass" /> Pool Bar 10h – 22h</span>
        </Reveal>
      </div>
    </section>
  );
}
