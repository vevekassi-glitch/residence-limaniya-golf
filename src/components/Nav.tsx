import { useEffect, useState } from "react";
import { useBodyLock } from "../lib/hooks";
import { IconClose } from "./icons";

const LINKS = [
  { href: "#maison", label: "La maison" },
  { href: "#chambres", label: "Chambres" },
  { href: "#salles", label: "Salles & séminaires" },
  { href: "#paiement", label: "Paiement" },
  { href: "#avis", label: "Le livre d'or" },
  { href: "#faq", label: "Questions" },
];

export default function Nav({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useBodyLock(open);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-sand/10 bg-night/95 py-3 backdrop-blur-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-brass/60 font-display text-xl italic text-brass transition-colors group-hover:bg-brass group-hover:text-night">
              A
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg tracking-wide text-sand">Azalaï</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.32em] text-sand/60">Résidence · Abidjan</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative font-mono text-[11px] uppercase tracking-[0.2em] text-sand/75 transition-colors hover:text-brass"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2.5 border border-sand/15 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sand/70 md:flex">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brass" />
              17 unités libres ce soir
            </span>
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

      {/* menu plein écran */}
      <div
        className={`fixed inset-0 z-[60] bg-night transition-all duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl italic text-brass">Azalaï</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="flex h-10 w-10 items-center justify-center border border-sand/20 text-sand transition-colors hover:border-brass hover:text-brass"
            >
              <IconClose size={18} />
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-2">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`font-display text-4xl font-light text-sand transition-all duration-500 hover:translate-x-3 hover:text-brass ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
              >
                <span className="mr-4 font-mono text-xs text-brass/70">0{i + 1}</span>
                {l.label}
              </a>
            ))}
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
              Boulevard Latrille, Cocody — Abidjan
              <br />
              +225 27 22 49 49 49 · bonjour@azalai.ci
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
