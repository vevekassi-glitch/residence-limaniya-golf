import { METHODS } from "../lib/data";
import { METHOD_LOGOS, IconShield, IconLock, IconPhone, IconCard, IconCheck, IconBell } from "./icons";
import { Reveal, SectionHead } from "./ui";
import type { Prefill } from "./Hero";
import { BrassButton } from "./ui";
import { todayIso, addDaysIso } from "../lib/api";

const SECURITY = [
  { icon: IconLock, title: "Aucune donnée stockée", text: "Les numéros de carte sont tokenisés par Stripe (PCI-DSS SAQ-A) et ne touchent jamais nos serveurs." },
  { icon: IconShield, title: "3-D Secure systématique", text: "Chaque paiement carte passe par l'authentification forte de votre banque, conforme DSP2." },
  { icon: IconPhone, title: "Vous seul validez", text: "En mobile money, la demande push n'aboutit qu'avec votre code secret personnel sur votre téléphone." },
  { icon: IconBell, title: "Reçu immédiat", text: "Confirmation par e-mail et SMS dès l'encaissement, facture PDF avec TVA disponible 24 h sur 24." },
];

export default function Payments({ onBook }: { onBook: (p: Prefill) => void }) {
  return (
    <section id="paiement" className="paper relative overflow-hidden bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="04"
          kicker="Paiement"
          title={
            <>
              Payez comme<br />
              vous <em className="text-clay">vivez.</em>
            </>
          }
        >
          <p>
            Wave pour les habitués de Dakar, Orange Money et MTN MoMo à Abidjan, Moov Money sur la route de Bouaké,
            Visa ou Stripe pour le reste du monde. Six canaux, une même sécurité, zéro guichet.
          </p>
        </SectionHead>

        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          {/* grille des moyens */}
          <div>
            <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
              {METHODS.map((m, i) => {
                const Logo = METHOD_LOGOS[m.id];
                return (
                  <Reveal key={m.id} delay={i * 70}>
                    <div className="group flex h-full flex-col justify-between gap-5 bg-paper p-6 transition-colors duration-300 hover:bg-parch">
                      <div className="flex items-start justify-between">
                        <span className="transition-transform duration-300 group-hover:-translate-y-1">
                          <Logo size={26} />
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">
                          {m.family === "Mobile Money" ? <IconPhone size={12} /> : <IconCard size={12} />}
                          {m.family}
                        </span>
                      </div>
                      <div>
                        <div className="font-display text-xl">{m.name}</div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
                          {m.region} · {m.speed}
                        </div>
                        <p className="mt-2 text-[13px] leading-relaxed text-ink/65">{m.note}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* les 3 temps */}
            <Reveal className="mt-12">
              <div className="grid gap-8 sm:grid-cols-3">
                {[
                  ["01", "Réservez", "Dates, chambre ou salle, coordonnées : deux minutes suffisent."],
                  ["02", "Choisissez", "Sélectionnez votre canal — Wave, OM, MoMo, carte — le total s'affiche taxes comprises."],
                  ["03", "Confirmez", "Validez sur votre téléphone ou via 3-D Secure. Le reçu arrive instantanément."],
                ].map(([n, t, d]) => (
                  <div key={n} className="border-t-2 border-clay/70 pt-4">
                    <span className="font-mono text-[11px] tracking-[0.3em] text-clay">{n}</span>
                    <div className="mt-2 font-display text-xl">{t}</div>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink/65">{d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* téléphone + sécurité */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={150}>
              <div className="relative mx-auto w-[270px] overflow-hidden border-[10px] border-ink bg-pine pb-8 pt-10 shadow-[0_30px_80px_rgba(14,33,26,0.35)]" style={{ borderRadius: 30 }}>
                <div className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-sand/15" />
                <div className="push-note mx-3 border border-sand/15 bg-night/95 p-3.5 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brass font-display text-sm italic text-night">A</span>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-sand/50">Résidence Azalaï</div>
                      <div className="text-xs font-medium text-sand">Payer 68 000 F — Deluxe Lagune ?</div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    <span className="flex-1 bg-brass py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-night">Oui, payer</span>
                    <span className="flex-1 border border-sand/25 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-sand/70">Plus tard</span>
                  </div>
                </div>
                <div className="mx-4 mt-5 space-y-2.5">
                  {[86, 64, 74, 40].map((w, i) => (
                    <div key={i} className="h-2 rounded-full bg-sand/10" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="mx-4 mt-5 border-t border-sand/10 pt-4 font-mono text-[9px] uppercase tracking-[0.22em] text-sand/40">
                  Validation sur votre mobile
                </div>
              </div>
            </Reveal>

            <div className="mt-12 space-y-6">
              {SECURITY.map((s, i) => (
                <Reveal key={s.title} delay={i * 90}>
                  <div className="flex gap-4 border-b border-ink/10 pb-6">
                    <span className="mt-1 text-clay"><s.icon size={20} /></span>
                    <div>
                      <div className="flex items-center gap-2.5 font-display text-lg">
                        {s.title}
                        <IconCheck size={13} className="text-emerald-800" />
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65">{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-8">
                <BrassButton dark={false} onClick={() => onBook({ kind: "room", from: todayIso(), to: addDaysIso(todayIso(), 2), guests: 2 })}>
                  Essayer avec une réservation
                </BrassButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
