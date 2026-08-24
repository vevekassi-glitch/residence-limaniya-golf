import { Reveal, SectionHead, BrassButton } from "./ui";
import { IconGolf, IconFlag, IconSun, IconCart } from "./icons";

const EXPERIENCES = [
  {
    icon: IconGolf,
    title: "Le Parcours",
    desc: "18 trous sur 62 hectares, du parcours des Presidents au green du 18e bordé de la lagune. Un défi pour chaque niveau, un paysage pour chaque trou.",
    detail: "Par 72 · 6 100 m",
  },
  {
    icon: IconFlag,
    title: "Le Clubhouse",
    desc: "Vue panoramique sur le 18e trou, restaurant Le Fromager et terrasse de lounge. L'endroit où les deals se font entre le 14e et le 15e birdie.",
    detail: "Restaurant & bar",
  },
  {
    icon: IconSun,
    title: "Le Driving Range",
    desc: "40 postes couverts, coachs certifiés PGA et analyse swing en vidéo. Ouvert de 6h à 20h, même les jours de pluie.",
    detail: "40 postes",
  },
  {
    icon: IconCart,
    title: "La Conciergerie Golf",
    desc: "Réservation tee-time, transfert vers les 9 parcours d'Abidjan, rangement sacs et nettoyage clubs. On s'occupe de tout, vous jouez.",
    detail: "Service complet",
  },
];

export default function Golf() {
  return (
    <section id="golf" className="relative overflow-hidden bg-night py-24 md:py-36">
      {/* halos d'ambiance */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-fern/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-[400px] w-[400px] rounded-full bg-brass/8 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="07"
          kicker="Golf & Prestige"
          dark
          title={
            <>
              Le golf<br />
              à votre <em className="text-brassl">porte.</em>
            </>
          }
        >
          <p>
            À deux minutes à pied de la résidence, le Golf du Houphouët-Boigny offre un parcours
            de championship, un club-house et un driving range. Notre conciergerie golf gère
            vos tee-times, transferts et préférences de jeu — vous n'avez qu'à apporter vos clubs.
          </p>
        </SectionHead>

        {/* carte parcours */}
        <Reveal>
          <div className="relative mb-16 overflow-hidden border border-sand/15 bg-pine/80 p-8 md:p-12">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-fern/40 to-transparent" />
            <div className="relative grid gap-10 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
                  Golf du Houphouët-Boigny
                </div>
                <h3 className="mt-4 font-display text-3xl font-light text-sand md:text-4xl">
                  18 trous.<br />
                  <span className="italic text-brassl">Un seul horizon.</span>
                </h3>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-mist/85">
                  Créé en 1957, le parcours s'étend sur 62 hectares entre forêt tropicale et berges de la lagune Ébrié.
                  Du tee du 1er au green du 18e, chaque trou raconte une histoire — celle d'Abidjan, celle du golf,
                  celle des rencontres qui se font sur le parcours.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-6">
                  {[
                    ["Par", "72"],
                    ["Longueur", "6 100 m"],
                    ["Difficulté", "Championship"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-brass">{label}</div>
                      <div className="mt-1 font-display text-xl text-sand">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <BrassButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Réserver un séjour golf
                  </BrassButton>
                </div>
              </div>

              {/* chiffres-clés */}
              <div className="flex flex-col gap-6">
                {[
                  { n: "9", label: "Parcours accessibles à Abidjan", sub: "et alentours" },
                  { n: "24", label: "Tee-time disponible par jour", sub: "en semaine" },
                  { n: "2", label: "Minutes de la résidence", sub: "à pied" },
                  { n: "365", label: "Jours d'ouverture", sub: "de 6h à 20h" },
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline gap-5 border-b border-sand/10 pb-5">
                    <span className="font-display text-4xl font-light text-brass">{s.n}</span>
                    <div>
                      <div className="text-sm text-sand/90">{s.label}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand/45">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* expériences golf */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.title} delay={i * 90}>
              <div className="group flex h-full flex-col border border-sand/12 p-6 transition-all duration-500 hover:border-brass/40 hover:bg-pine/50">
                <span className="mb-5 text-brass transition-transform duration-300 group-hover:-translate-y-1">
                  <exp.icon size={24} />
                </span>
                <h4 className="font-display text-xl text-sand">{exp.title}</h4>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mist/80">{exp.desc}</p>
                <div className="mt-4 border-t border-sand/10 pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
                  {exp.detail}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* baseline */}
        <Reveal delay={200} className="mt-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand/45">
            Partenaire officiel du <span className="text-brass">Golf du Houphouët-Boigny</span> — Abidjan, Côte d'Ivoire
          </p>
        </Reveal>
      </div>
    </section>
  );
}
