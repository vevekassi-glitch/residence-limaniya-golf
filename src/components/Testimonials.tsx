import { TESTIMONIALS } from "../lib/data";
import { Reveal, SectionHead } from "./ui";
import { IconStar } from "./icons";

export default function Testimonials() {
  return (
    <section id="avis" className="relative overflow-hidden bg-night py-24 md:py-36">
      <div className="pointer-events-none absolute left-1/3 top-0 h-[420px] w-[420px] rounded-full bg-fern/30 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="05"
          kicker="Le livre d'or"
          dark
          title={
            <>
              Ils ont laissé<br />
              un <em className="text-brassl">mot.</em>
            </>
          }
        >
          <p>
            Extraits du registre de la réception — recopiés tels quels, fautes d'enthousiasme comprises.
          </p>
        </SectionHead>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 110}>
              <blockquote
                className="group relative flex h-full flex-col bg-sand px-6 pb-6 pt-9 text-ink shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-2 hover:rotate-0"
                style={{ transform: `rotate(${t.rot}deg)`, marginTop: i % 2 ? "2.2rem" : 0 }}
              >
                {/* ruban adhésif */}
                <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 bg-brass/45 shadow-sm" />
                <div className="flex gap-1 text-clay">
                  {[...Array(5)].map((_, j) => (
                    <IconStar key={j} size={13} />
                  ))}
                </div>
                <p className="mt-4 flex-1 font-display text-[17px] italic leading-relaxed text-ink/90">« {t.quote} »</p>
                <footer className="mt-6 border-t border-ink/15 pt-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">{t.author}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">{t.role}</div>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220} className="mt-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand/45">
            Note moyenne <span className="text-brass">4,86 / 5</span> — 1 240 séjours notés en 2025
          </p>
        </Reveal>
      </div>
    </section>
  );
}
