import { IMAGES, STATS } from "../lib/data";
import { useCountUp, useInView } from "../lib/hooks";
import { Reveal, SectionHead } from "./ui";

function Stat({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const n = useCountUp(value, start);
  return (
    <div className="border-l border-brass/40 pl-5">
      <div className="font-display text-5xl font-light text-sand">
        {n}
        <span className="text-brass">{suffix}</span>
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-sand/55">{label}</div>
    </div>
  );
}

const SHOTS = [
  { src: IMAGES.lobby, caption: "La réception — marbre vert, laiton, clés numérotées à la main", ratio: "aspect-[4/3]" },
  { src: IMAGES.restaurant, caption: "Le Fromager, la table de la résidence, les pieds dans l'eau", ratio: "aspect-[16/10]" },
  { src: IMAGES.conference, caption: "L'Amphithéâtre Le Phare, deux heures avant une plénière", ratio: "aspect-[4/3]" },
];

export default function About() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section id="maison" className="relative overflow-hidden bg-night py-24 md:py-36">
      {/* halo d'ambiance */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[560px] w-[560px] rounded-full bg-fern/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full bg-brass/10 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        {/* colonne collante */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            index="01"
            kicker="La maison"
            dark
            title={
              <>
                Une adresse<br />
                à hauteur<br />
                <em className="text-brassl">de lagune.</em>
              </>
            }
          >
            <p>
              Depuis 1987, la Résidence Azalaï occupe un hectare de jardins entre le boulevard Latrille
              et la lagune Ébrié. On y vient pour une nuit d'escale, on y reste pour un comité de direction,
              on y revient pour le silence des chambres et la lumière de 17 heures sur l'eau.
            </p>
            <p className="mt-4">
              Chaque chambre est orientée au sud-ouest, chaque salle est câblée en fibre dédiée,
              et chaque facture peut se payer du fond de votre canapé — Wave, Orange Money, MTN MoMo,
              Moov Money ou carte bancaire.
            </p>
          </SectionHead>

          <Reveal delay={120}>
            <div ref={ref} className="grid grid-cols-2 gap-x-8 gap-y-10">
              {STATS.map((s) => (
                <Stat key={s.label} {...s} start={inView} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-14 font-display text-xl italic text-sand/70">
              « L'hospitalité est un artisanat. »
              <span className="mt-2 block font-mono text-[10px] not-italic uppercase tracking-[0.3em] text-brass">
                — Aïcha Koné, directrice générale
              </span>
            </p>
          </Reveal>
        </div>

        {/* colonne d'images défilantes */}
        <div className="flex flex-col gap-10 lg:gap-14">
          {SHOTS.map((s, i) => (
            <Reveal key={s.src} delay={i * 110} className={i === 1 ? "lg:-ml-16 lg:w-[85%]" : i === 2 ? "lg:ml-10 lg:w-[90%]" : ""}>
              <figure className="group">
                <div className={`imgkb ${s.ratio} relative`}>
                  <img src={s.src} alt={s.caption} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 border border-sand/25 bg-night/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-sand/85">
                    Fig. 0{i + 1}
                  </span>
                </div>
                <figcaption className="mt-3 flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sand/50">
                  <span className="h-px w-8 shrink-0 bg-brass/50" />
                  {s.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
