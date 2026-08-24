import { useEffect, useState, useCallback } from "react";
import { useBodyLock } from "../lib/hooks";
import { IconClose } from "./icons";

const LINKS = [
  { href: "#hero", label: "Accueil", id: "hero" },
  { href: "#chambres", label: "Chambres & Salles", id: "chambres" },
  { href: "#salles", label: "Séminaires", id: "salles" },
  { href: "#restaurant", label: "Restaurant & Lounge", id: "restaurant" },
  { href: "#services", label: "Services", id: "services" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function Nav({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  useBodyLock(open);

  /* ——— Scroll spy ——— */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);

    // Find which section is currently in view
    const offsets = LINKS.map((l) => {
      if (l.id === "hero") return { id: "hero", top: 0 };
      const el = document.getElementById(l.id);
      return { id: l.id, top: el ? el.getBoundingClientRect().top : Infinity };
    });

    // Pick the section whose top is closest to (but below) the nav height
    const navH = 80;
    let current = "hero";
    for (const o of offsets) {
      if (o.top <= navH + 120) current = o.id;
    }
    setActive(current);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-sand/10 bg-night/95 py-3 backdrop-blur-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          {/* Logo — sans sous-titre */}
          <a href="#" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-brass/60 font-display text-xl italic text-brass transition-colors group-hover:bg-brass group-hover:text-night">
              A
            </span>
            <span className="font-display text-lg tracking-wide text-sand">
              Limaniya <em className="text-brass">Golf</em>
            </span>
          </a>

          {/* Nav links — alignés, non wrappés */}
          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
            {LINKS.map((l) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`group relative whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    isActive ? "text-brass" : "text-sand/75 hover:text-brass"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-brass transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Bouton Réserver — sans badge unités */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBook}
              className="hidden border border-brass bg-brass px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-night transition-all duration-300 hover:bg-transparent hover:text-brass sm:block"
            >
              Réserver
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-sand/20 lg:hidden"
            >
              <span className="h-px w-4 bg-sand" />
              <span className="h-px w-4 bg-brass" />
              <span className="h-px w-4 bg-sand" />
            </button>
          </div>
        </div>
      </header>

      {/* menu mobile plein écran */}
      <div
        className={`fixed inset-0 z-[60] bg-night transition-all duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl italic text-brass">Limaniya <span className="text-brassl">Golf</span></span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="flex h-10 w-10 items-center justify-center border border-sand/20 text-sand transition-colors hover:border-brass hover:text-brass"
            >
              <IconClose size={18} />
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-2">
            {LINKS.map((l, i) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`font-display text-4xl font-light transition-all duration-500 hover:translate-x-3 hover:text-brass ${
                    isActive ? "text-brass" : "text-sand"
                  } ${
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  <span className={`mr-4 font-mono text-xs ${isActive ? "text-brass" : "text-brass/70"}`}>0{i + 1}</span>
                  {l.label}
                </a>
              );
            })}
          </nav>
          <div className="mt-auto">
            <button
              onClick={() => {
                setOpen(false);
                onBook();
              }}
              className="w-full border border-brass bg-brass py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-night transition-colors hover:bg-brassl"
            >
              Réserver maintenant
            </button>
            <div className="mt-6 border-t border-sand/10 pt-6 font-mono text-xs leading-relaxed text-sand/60">
              Riviera 4, Rue E40 — Abidjan
              <br />
              07 77 70 82 24 · bonjour@limaniya.ci
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
