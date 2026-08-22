import { useState } from "react";
import { FAQS } from "../lib/data";
import { Reveal, SectionHead } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="paper bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            index="06"
            kicker="Questions"
            title={
              <>
                Ce qu'on nous<br />
                demande <em className="text-clay">souvent.</em>
              </>
            }
          >
            <p>
              Et si la réponse n'y est pas, la conciergerie répond en moins d'une heure,
              même un dimanche de fête des mères.
            </p>
            <a
              href="mailto:bonjour@azalai.ci"
              className="mt-8 inline-block border-b border-clay pb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-clay transition-colors hover:border-ink hover:text-ink"
            >
              bonjour@azalai.ci
            </a>
          </SectionHead>
        </div>

        <div className="hairline-t dark-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 60} className="hairline-b dark-line">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-clay">Q{i + 1}</span>
                    <span className={`font-display text-xl font-light transition-colors md:text-2xl ${isOpen ? "text-clay" : "text-ink group-hover:text-clay"}`}>
                      {f.q}
                    </span>
                  </span>
                  <span
                    className={`relative h-4 w-4 shrink-0 transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                  >
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-clay" />
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-clay" />
                  </span>
                </button>
                <div className={`acc-body ${isOpen ? "open" : ""}`}>
                  <div>
                    <p className="max-w-2xl pb-7 pl-[38px] text-[14px] leading-relaxed text-ink/70">{f.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
