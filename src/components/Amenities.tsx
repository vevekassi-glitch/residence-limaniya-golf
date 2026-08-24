import { AMENITIES } from "../lib/data";
import { Reveal, SectionHead } from "./ui";
import { AmenityIcon, IconShuttle, IconWifi, IconCar, IconGym, IconBell, IconDesk, IconLeaf, IconResto } from "./icons";

const SERVICES_DETAIL = [
  { icon: IconShuttle, title: "Navette aéroport", desc: "Félix-Houphouët-Boigny, toutes les heures. Réservez à la réception ou en un clic depuis votre chambre.", hours: "24h/24" },
  { icon: IconWifi, title: "Fibre 1 Gb/s", desc: "Wi-Fi haut débit dans toute la résidence — chambres, jardins, piscine, restaurant. Connexion invité en QR code.", hours: "Partout" },
  { icon: IconCar, title: "Parking privé gardé", desc: "60 places couvertes, voiturier sur demande, borne de recharge Tesla et véhicules électriques.", hours: "Gardé 24h" },
  { icon: IconGym, title: "Salle de sport", desc: "Cardio, musculation, yoga au lever du soleil sur la terrasse. Coach personnel sur demande.", hours: "24/7" },
  { icon: IconResto, title: "Traiteur événementiel", desc: "Cocktails, mariages, galas, séminaires — notre chef cuisine sur mesure. Menus africains, internationaux, buffet ou service assis.", hours: "Sur devis" },
  { icon: IconBell, title: "Conciergerie 24/7", desc: "Réservations restaurants, places de concert, transferts, plongée sous-marine — rien n'est trop grand ni trop petit.", hours: "24h/24, 7j/7" },
  { icon: IconDesk, title: "Lounge coworking", desc: "Espaces de travail privatifs, salles de visio, impression. Parfait pour les équipes en déplacement.", hours: "6h – 22h" },
  { icon: IconLeaf, title: "Jardin d'un hectare", desc: "Jardins tropicaux entre la résidence et la lagune, sentiers de promenade, bancs ombragés, coin lecture.", hours: "Accès libre" },
];

export default function Amenities() {
  const row = [...AMENITIES, ...AMENITIES];
  return (
    <section id="services" className="relative overflow-hidden bg-night py-24 md:py-36">
      {/* halos */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[480px] w-[480px] rounded-full bg-fern/15 blur-[130px]" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-[400px] w-[400px] rounded-full bg-brass/8 blur-[120px]" />

      <div className="relative">
        {/* ticker decoratif */}
        <div className="mb-16 overflow-hidden border-y border-sand/10 py-3" aria-hidden="true">
          <div className="ticker-track">
            {row.map((a, i) => (
              <span
                key={`a-${i}`}
                className="mx-4 flex shrink-0 items-center gap-3 border border-sand/12 px-6 py-3 font-body text-sm text-sand/80 transition-colors duration-300 hover:border-brass/50 hover:text-brass"
              >
                <AmenityIcon name={a.icon} size={18} className="text-brass" />
                {a.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead
            index="05"
            kicker="Art de vivre"
            dark
            title={
              <>
                Les services<br />
                de la <em className="text-brassl">maison.</em>
              </>
            }
          >
            <p>
              Tout est pensé pour que le séjour file sans accroc. De la navette aéroport
              à la conciergerie 24/7, chaque détail est pensé pour que vous n'ayez à penser à rien.
            </p>
          </SectionHead>

          {/* grille services */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DETAIL.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="group flex h-full flex-col border border-sand/12 p-6 transition-all duration-500 hover:border-brass/35 hover:bg-pine/40">
                  <div className="flex items-start justify-between">
                    <span className="text-brass transition-transform duration-300 group-hover:-translate-y-1">
                      <s.icon size={22} />
                    </span>
                    <span className="border border-brass/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-brass/80">
                      {s.hours}
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-lg text-sand">{s.title}</h4>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mist/80">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400} className="mt-14">
            <p className="max-w-2xl text-[15px] leading-relaxed text-mist/85">
              La conciergerie trouve des places au Plateau même un samedi soir, la navette vous cueille à FHB
              à toute heure, le linge revient le jour même, et la salle de sport ne ferme jamais.
              Votre seul rôle : profiter.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
