import { useState } from "react";
import type { CatalogItem } from "../lib/types";
import { fcfa } from "../lib/format";
import { BrassButton, Reveal } from "./ui";
import {
  IconBed,
  IconRuler,
  IconUsers,
  IconCheck,
  IconClose,
  IconArrow,
  IconWifi,
  IconLock,
  IconBell,
  IconScreen,
  IconPhone,
  IconDesk,
  IconSun,
  IconResto,
  IconCart,
  IconLeaf,
  IconDroplet,
} from "./icons";
import type { Prefill } from "./Hero";
import { todayIso } from "../lib/api";

/* ——— Equipment → icon mapping ——— */
const EQUIP_ICONS: Record<string, (p: { size?: number; className?: string }) => React.ReactElement> = {
  // Suite
  "Lit king size": (p) => <IconBed {...p} />,
  "Vidéophone": (p) => <IconPhone {...p} />,
  "Salon privé": (p) => <IconDesk {...p} />,
  "Coiffeuse": (p) => <IconSun {...p} />,
  "Boiserie de luxe": (p) => <IconLeaf {...p} />,
  "Terrasse aménagée": (p) => <IconSun {...p} />,
  "Bar": (p) => <IconCart {...p} />,
  "Cuisine équipée": (p) => <IconResto {...p} />,
  "Machine à café": (p) => <IconResto {...p} />,
  "Micro-ondes": (p) => <IconResto {...p} />,
  "Réfrigérateur": (p) => <IconResto {...p} />,
  "Pèse-personne": (p) => <IconRuler {...p} />,
  "Fer à repasser": (p) => <IconRuler {...p} />,
  // Chambre
  "Lit double": (p) => <IconBed {...p} />,
  "Air conditionné": (p) => <IconSun {...p} />,
  "Écran LCD mural amovible": (p) => <IconScreen {...p} />,
  "Smart TV OLED / QLED": (p) => <IconScreen {...p} />,
  "Mini-bar": (p) => <IconCart {...p} />,
  "Bouilloire": (p) => <IconResto {...p} />,
  "Produits de toilette": (p) => <IconLeaf {...p} />,
  "Lampes de chevet": (p) => <IconSun {...p} />,
  "WC suspendu": (p) => <IconResto {...p} />,
  "Eau minérale en chambre": (p) => <IconDroplet {...p} />,
  // Shared
  "Smart TV": (p) => <IconScreen {...p} />,
  "Espace bureau": (p) => <IconDesk {...p} />,
  "Chaînes câblées": (p) => <IconScreen {...p} />,
  "Plateau de courtoisie": (p) => <IconLeaf {...p} />,
  "Wi-Fi haut débit": (p) => <IconWifi {...p} />,
  "Room service 24h/24": (p) => <IconBell {...p} />,
  "Coffre-fort": (p) => <IconLock {...p} />,
};

function getEquipIcon(label: string, props: { size?: number; className?: string }) {
  const Icon = EQUIP_ICONS[label];
  if (Icon) return Icon(props);
  return <IconCheck {...props} />;
}

export default function SuiteDetail({
  room,
  onBook,
}: {
  room: CatalogItem;
  onBook: (p: Prefill) => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const gallery = room.gallery ?? [room.img];

  return (
    <section id={room.id === "st-limaniya" ? "suite-detail" : room.id} className="relative bg-paper py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* ——— Gallery ——— */}
        <Reveal>
          <div className="relative">
            {/* Main image */}
            <div
              className="imgkb relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-sm md:aspect-[21/9]"
              onClick={() => setLightbox(true)}
            >
              <img
                src={gallery[activeImg]}
                alt={`${room.name} — photo ${activeImg + 1}`}
                className="h-full w-full object-cover transition-opacity duration-500"
              />
              <span className="absolute bottom-4 right-4 bg-night/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-sand backdrop-blur-sm">
                {activeImg + 1} / {gallery.length}
              </span>
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-sm border-2 transition-all md:h-20 md:w-28 ${
                      i === activeImg
                        ? "border-clay opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Miniature ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* ——— Lightbox ——— */}
        {lightbox && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-night/90 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-4 top-4 z-10 text-paper/80 hover:text-paper"
              onClick={() => setLightbox(false)}
            >
              <IconClose size={28} />
            </button>
            <button
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-paper/60 hover:text-paper"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImg((prev) => (prev - 1 + gallery.length) % gallery.length);
              }}
            >
              <IconArrow size={32} className="-rotate-180" />
            </button>
            <button
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-paper/60 hover:text-paper"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImg((prev) => (prev + 1) % gallery.length);
              }}
            >
              <IconArrow size={32} />
            </button>
            <img
              src={gallery[activeImg]}
              alt={`${room.name} — photo ${activeImg + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">
              {activeImg + 1} / {gallery.length}
            </span>
          </div>
        )}

        {/* ——— Content grid ——— */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Left: Equipment */}
          <Reveal delay={80}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">Équipements & caractéristiques</p>
              <h2 className="mt-3 font-display text-3xl font-light tracking-tight md:text-4xl">
                {room.name}
              </h2>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-clay">{room.tagline}</p>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/70">{room.description}</p>

              {/* Equipment grid */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {room.features.map((feat) => {
                  const label = feat.replace(/ — \d+ personnes$/, "");
                  return (
                    <div
                      key={feat}
                      className="flex items-center gap-3 rounded-sm border border-ink/8 bg-cream/40 px-4 py-3 transition-colors hover:border-clay/30 hover:bg-cream/60"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay/10 text-clay">
                        {getEquipIcon(label, { size: 16 })}
                      </span>
                      <span className="text-[13px] text-ink/80">{feat}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Right: Booking card */}
          <Reveal delay={160}>
            <div className="sticky top-28 rounded-sm border border-ink/10 bg-cream/30 p-6 backdrop-blur-sm">
              <div className="flex items-baseline gap-3 border-b border-ink/10 pb-4">
                <IconBed size={20} className="text-clay" />
                <span className="font-display text-xl">{room.name}</span>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-sm bg-paper/60 py-3">
                  <IconUsers size={18} className="mx-auto text-clay" />
                  <p className="mt-1 font-mono text-lg text-ink">{room.capacity}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">personnes</p>
                </div>
                <div className="rounded-sm bg-paper/60 py-3">
                  <IconRuler size={18} className="mx-auto text-clay" />
                  <p className="mt-1 font-mono text-lg text-ink">{room.size}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">m²</p>
                </div>
                <div className="rounded-sm bg-paper/60 py-3">
                  <IconBed size={18} className="mx-auto text-clay" />
                  <p className="mt-1 font-mono text-sm text-ink leading-tight">{room.beds}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">couchage</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-6 border-t border-ink/10 pt-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/45">À partir de</span>
                    <div className="font-display text-3xl text-ink">
                      {fcfa(room.price)}
                      <span className="font-mono text-xs text-ink/50"> / {room.unit}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-700" />
                    {room.stock} disponible{room.stock > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[9px] text-ink/40">
                  TVA 18 % · service 7 % · petit-déjeuner inclus
                </p>
              </div>

              {/* CTA */}
              <BrassButton
                dark={false}
                className="mt-6 w-full justify-center"
                onClick={() =>
                  onBook({
                    kind: "room",
                    itemId: room.id,
                    from: todayIso(),
                    to: "",
                    guests: room.capacity,
                  })
                }
              >
                Demander une réservation
              </BrassButton>

              <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-ink/35">
                Confirmation sous 2 h · Annulation gratuite 48 h
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
