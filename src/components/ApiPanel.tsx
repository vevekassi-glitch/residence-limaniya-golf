import { useState } from "react";
import { useBodyLock, useEscape } from "../lib/hooks";
import { checkAvailability, addDaysIso, todayIso } from "../lib/api";
import { useToast } from "./ui";
import { IconClose, IconCopy, IconCheck } from "./icons";

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const API_BASE = env?.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";
const LIVE = Boolean(env?.VITE_API_URL);

const ENDPOINTS: { method: "GET" | "POST"; path: string; desc: string }[] = [
  { method: "GET", path: "/rooms", desc: "Catalogue des chambres & tarifs" },
  { method: "GET", path: "/halls", desc: "Salles de conférence & dispositions" },
  { method: "GET", path: "/availability?item_id=&from=&to=", desc: "Unités restantes sur un intervalle" },
  { method: "POST", path: "/reservations", desc: "Créer une réservation — stock verrouillé" },
  { method: "POST", path: "/payments/initiate", desc: "Push Wave · OM · MTN MoMo · Moov (CinetPay)" },
  { method: "GET", path: "/payments/{ref}/status", desc: "Polling PENDING → CONFIRMED" },
  { method: "POST", path: "/payments/card", desc: "Carte bancaire via Stripe (3-D Secure)" },
  { method: "POST", path: "/webhooks/cinetpay", desc: "Notification opérateur — signature HMAC" },
  { method: "POST", path: "/webhooks/stripe", desc: "Notification Stripe — signature vérifiée" },
];

export default function ApiPanel({ onClose }: { onClose: () => void }) {
  useBodyLock(true);
  useEscape(true, onClose);
  const toast = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testOut, setTestOut] = useState<string | null>(null);

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
      toast("Copié dans le presse-papiers.");
    } catch {
      toast("Copie impossible — sélectionnez le texte manuellement.");
    }
  };

  const runTest = async () => {
    setTesting(true);
    setTestOut(null);
    const t0 = performance.now();
    try {
      const res = await checkAvailability("ch-verte", todayIso(), addDaysIso(todayIso(), 2));
      const ms = Math.round(performance.now() - t0);
      setTestOut(`HTTP 200 OK — ${ms} ms\n${JSON.stringify(res, null, 2)}`);
    } catch (e) {
      setTestOut(`HTTP 422 — ${e instanceof Error ? e.message : "erreur inconnue"}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <button aria-label="Fermer" onClick={onClose} className="fade-in absolute inset-0 w-full bg-night/80" />
      <aside className="drawer-in paper-scheme absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col bg-paper text-ink shadow-[-30px_0_80px_rgba(0,0,0,0.5)]">
        <header className="hairline-b dark-line flex items-center justify-between px-6 py-4 md:px-8">
          <div>
            <div className="font-display text-xl italic">API & intégration</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">Backend Laravel 12 — Résidence Azalaï</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le panneau"
            className="flex h-10 w-10 items-center justify-center border border-ink/20 transition-colors hover:border-clay hover:text-clay"
          >
            <IconClose size={17} />
          </button>
        </header>

        <div className="slim-scroll flex-1 overflow-y-auto px-6 py-7 md:px-8">
          {/* statut */}
          <div className="flex items-center gap-3 border border-ink/12 bg-parch px-4 py-3">
            <span className={`pulse-dot h-2 w-2 rounded-full ${LIVE ? "bg-emerald-700" : "bg-clay"}`} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">
              {LIVE ? "API Laravel connectée" : "Mode démo — backend simulé dans le navigateur"}
            </span>
          </div>

          {/* URL de base — LE lien */}
          <div className="mt-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">URL de base</span>
            <div className="mt-2 flex items-stretch gap-px overflow-hidden bg-night">
              <code className="flex-1 overflow-x-auto whitespace-nowrap px-4 py-3.5 font-mono text-[13px] text-brassl">
                {API_BASE}
              </code>
              <button
                onClick={() => copy(API_BASE, "base")}
                className="flex items-center gap-2 bg-brass px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-night transition-colors hover:bg-brassl"
              >
                {copied === "base" ? <IconCheck size={13} /> : <IconCopy size={13} />}
                {copied === "base" ? "Copié" : "Copier"}
              </button>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-ink/55">
              Lancez le backend (dossier <code className="bg-parch px-1 font-mono text-[11px]">/backend</code> du projet) avec{" "}
              <code className="bg-parch px-1 font-mono text-[11px]">php artisan serve</code>, puis définissez{" "}
              <code className="bg-parch px-1 font-mono text-[11px]">VITE_API_URL</code> dans le front :
              la démo bascule automatiquement sur l'API réelle, sans autre changement.
            </p>
          </div>

          {/* mise en route */}
          <div className="mt-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">Mise en route — 4 commandes</span>
            <div className="hairline-t dark-line mt-3">
              {[
                "composer create-project laravel/laravel azalai-api && cd azalai-api",
                "php artisan install:api && composer require stripe/stripe-php",
                "cp backend/app backend/routes backend/database/* .  (structure du dossier /backend)",
                "php artisan migrate && php artisan serve   →  http://127.0.0.1:8000/api/v1",
              ].map((cmd, i) => (
                <div key={cmd} className="hairline-b dark-line group flex items-center gap-4 py-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-clay">0{i + 1}</span>
                  <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-ink/80">{cmd}</code>
                  <button
                    onClick={() => copy(cmd, `cmd-${i}`)}
                    aria-label="Copier la commande"
                    className="text-ink/40 transition-colors hover:text-clay"
                  >
                    {copied === `cmd-${i}` ? <IconCheck size={14} /> : <IconCopy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* endpoints */}
          <div className="mt-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">Endpoints — préfixe /api/v1</span>
            <div className="hairline-t dark-line mt-3">
              {ENDPOINTS.map((ep) => (
                <div key={ep.path} className="hairline-b dark-line group py-3.5 transition-colors hover:bg-white/50">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-14 shrink-0 border px-2 py-1 text-center font-mono text-[9px] uppercase tracking-[0.15em] ${
                        ep.method === "GET" ? "border-fern text-fern" : "border-clay text-clay"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-medium">{ep.path}</code>
                    <button
                      onClick={() => copy(API_BASE + ep.path.replace(/\{ref\}/, "CP-1842-77120"), `ep-${ep.path}`)}
                      aria-label="Copier l'URL complète"
                      className="text-ink/35 transition-colors hover:text-clay"
                    >
                      {copied === `ep-${ep.path}` ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    </button>
                  </div>
                  <p className="mt-1.5 pl-[68px] text-xs text-ink/55">{ep.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* test live */}
          <div className="mt-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">Essayer maintenant</span>
            <div className="mt-3 border border-ink/12 bg-parch p-4">
              <p className="text-xs leading-relaxed text-ink/60">
                Appelle <code className="font-mono">GET /availability</code> pour la Chambre Verte,
                via le client actuel ({LIVE ? "API Laravel" : "simulation"}).
              </p>
              <button
                onClick={runTest}
                disabled={testing}
                className="mt-3 w-full bg-ink py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper transition-colors hover:bg-clay disabled:opacity-60"
              >
                {testing ? "Requête en cours…" : "Envoyer la requête"}
              </button>
              {testOut && (
                <pre className="fade-in slim-scroll mt-3 overflow-x-auto bg-night p-4 font-mono text-[11px] leading-relaxed text-brassl">
                  {testOut}
                </pre>
              )}
            </div>
          </div>

          {/* sécurité */}
          <div className="mt-8 border-l-2 border-clay pl-4">
            <p className="text-xs leading-relaxed text-ink/60">
              <span className="font-medium text-ink">Sécurité :</span> Sanctum + throttle sur toutes les routes,
              webhooks à signature vérifiée (HMAC CinetPay, <code className="font-mono">Stripe-Signature</code>),
              idempotence sur les paiements, devis calculé côté serveur. Les numéros de carte ne touchent
              jamais le serveur (Stripe Elements, PCI-DSS SAQ-A). Détails dans{" "}
              <code className="bg-parch px-1 font-mono text-[11px]">backend/README.md</code> et{" "}
              <code className="bg-parch px-1 font-mono text-[11px]">ARCHITECTURE.md</code>.
            </p>
          </div>
        </div>

        <footer className="hairline-t dark-line flex items-center justify-between bg-parch px-6 py-4 md:px-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/45">Sources : dossier /backend</span>
          <a
            href={API_BASE + "/rooms"}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-clay transition-colors hover:text-ink"
          >
            Ouvrir dans un onglet
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </footer>
      </aside>
    </div>
  );
}
