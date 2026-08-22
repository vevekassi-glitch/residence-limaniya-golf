import { createContext, useCallback, useContext, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../lib/hooks";

/* ————— Reveal on scroll ————— */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "figure" | "li" | "article";
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`rv ${inView ? "rv-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ————— Section heading (signature) ————— */
export function SectionHead({
  index,
  kicker,
  title,
  dark = false,
  children,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <div className={`flex items-baseline gap-4 ${dark ? "text-brass" : "text-clay"}`}>
          <span className="font-mono text-xs tracking-[0.3em]">{index}</span>
          <span className={`h-px w-14 ${dark ? "bg-brass/50" : "bg-clay/50"}`} />
          <span className="font-mono text-xs uppercase tracking-[0.3em]">{kicker}</span>
        </div>
      </Reveal>
      <Reveal delay={90}>
        <h2
          className={`mt-6 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.02] font-light tracking-tight ${
            dark ? "text-sand" : "text-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal delay={180}>
          <div className={`mt-6 max-w-xl text-[15px] leading-relaxed ${dark ? "text-mist" : "text-ink/70"}`}>{children}</div>
        </Reveal>
      )}
    </div>
  );
}

/* ————— Brass button ————— */
export function BrassButton({
  children,
  onClick,
  dark = true,
  className = "",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  dark?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex items-center gap-3 border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300 disabled:opacity-50 ${
        dark
          ? "border-brass/60 bg-brass text-night hover:bg-brassl hover:border-brassl active:scale-[0.98]"
          : "border-ink/30 bg-transparent text-ink hover:bg-ink hover:text-paper active:scale-[0.98]"
      } ${className}`}
    >
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-300 group-hover:translate-x-1.5">
        <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ————— Toasts ————— */
interface Toast {
  id: number;
  text: string;
}
const ToastCtx = createContext<(text: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-6 z-[95] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="step-in border border-brass/40 bg-pine/95 px-5 py-3 font-mono text-xs text-sand shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <span className="mr-2 text-brass">◆</span>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
