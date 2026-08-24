import { useState } from "react";
import { Reveal, SectionHead } from "./ui";
import { IconPin, IconPhone, IconArrow } from "./icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string; // honeypot
}

interface FormStatus {
  type: "idle" | "sending" | "success" | "error";
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "", // honeypot — must stay empty
  });
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      e.name = "Le nom doit contenir au moins 2 caractères.";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Adresse email invalide.";
    }
    if (form.phone && !/^[\d\s\+\-\(\)]{8,20}$/.test(form.phone)) {
      e.phone = "Numéro de téléphone invalide.";
    }
    if (!form.subject.trim() || form.subject.trim().length < 3) {
      e.subject = "L'objet doit contenir au moins 3 caractères.";
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      e.message = "Le message doit contenir au moins 10 caractères.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (form.website) return;

    if (!validate()) return;

    setStatus({ type: "sending", message: "Envoi en cours..." });

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi.");
      }

      setStatus({ type: "success", message: data.message });
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
      setErrors({});
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Erreur de connexion. Réessayez.",
      });
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /* Shared classes — light text for dark background */
  const fieldError = (field: keyof FormData) => !!errors[field];

  return (
    <section id="contact" className="relative overflow-hidden bg-night py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* ── Left: Info ── */}
          <Reveal>
            <div>
              <SectionHead
                index="06"
                kicker="Contact"
                title={
                  <>
                    Parlons de votre<br />
                    <em className="text-brass">séjour.</em>
                  </>
                }
              >
                <p className="text-sand/70">
                  Que ce soit pour une réservation, un séminaire, un mariage ou simplement
                  pour poser une question — notre équipe vous répond sous 24 heures.
                </p>
              </SectionHead>

              <div className="mt-12 space-y-8">
                {/* Adresse */}
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brass/30 text-brass">
                    <IconPin size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">Adresse</p>
                    <p className="mt-1 text-sm text-sand/80">
                      Riviera 4, Rue E40<br />
                      Abidjan, Côte d'Ivoire
                    </p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brass/30 text-brass">
                    <IconPhone size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">Téléphone</p>
                    <p className="mt-1 text-sm text-sand/80">
                      07 77 70 82 24 / 07 77 70 82 32
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brass/30 text-brass">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">Email</p>
                    <p className="mt-1 text-sm text-sand/80">
                      bonjour@limaniya.ci
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Right: Form ── */}
          <Reveal delay={120}>
            <form onSubmit={handleSubmit} className="relative rounded-sm border border-sand/10 bg-sand/[0.04] p-8 backdrop-blur-sm">
              {/* Honeypot — hidden from humans */}
              <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>

              <h3 className="font-display text-xl text-sand">Envoyez-nous un message</h3>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sand/50">
                Tous les champs marqués * sont obligatoires
              </p>

              <div className="mt-8 space-y-6">
                {/* ── Nom ── */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Votre nom"
                    className={`w-full border-b bg-transparent py-3 font-body text-sm text-sand outline-none transition-colors placeholder:text-sand/30 ${
                      fieldError("name")
                        ? "border-red-500 focus:border-red-500"
                        : "border-sand/20 focus:border-brass"
                    }`}
                  />
                  {errors.name && <p className="mt-1 font-mono text-[10px] text-red-400">{errors.name}</p>}
                </div>

                {/* ── Email ── */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="votre@email.com"
                    className={`w-full border-b bg-transparent py-3 font-body text-sm text-sand outline-none transition-colors placeholder:text-sand/30 ${
                      fieldError("email")
                        ? "border-red-500 focus:border-red-500"
                        : "border-sand/20 focus:border-brass"
                    }`}
                  />
                  {errors.email && <p className="mt-1 font-mono text-[10px] text-red-400">{errors.email}</p>}
                </div>

                {/* ── Téléphone ── */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+225 07 77 70 82 24"
                    className={`w-full border-b bg-transparent py-3 font-body text-sm text-sand outline-none transition-colors placeholder:text-sand/30 ${
                      fieldError("phone")
                        ? "border-red-500 focus:border-red-500"
                        : "border-sand/20 focus:border-brass"
                    }`}
                  />
                  {errors.phone && <p className="mt-1 font-mono text-[10px] text-red-400">{errors.phone}</p>}
                </div>

                {/* ── Objet ── */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                    Objet *
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder="Réservation, séminaire, événement..."
                    className={`w-full border-b bg-transparent py-3 font-body text-sm text-sand outline-none transition-colors placeholder:text-sand/30 ${
                      fieldError("subject")
                        ? "border-red-500 focus:border-red-500"
                        : "border-sand/20 focus:border-brass"
                    }`}
                  />
                  {errors.subject && <p className="mt-1 font-mono text-[10px] text-red-400">{errors.subject}</p>}
                </div>

                {/* ── Message (textarea) ── */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                    Message *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Décrivez votre demande..."
                    rows={5}
                    className={`w-full resize-none border-b bg-transparent py-3 font-body text-sm text-sand outline-none transition-colors placeholder:text-sand/30 ${
                      fieldError("message")
                        ? "border-red-500 focus:border-red-500"
                        : "border-sand/20 focus:border-brass"
                    }`}
                    style={{ minHeight: "120px" }}
                  />
                  {errors.message && <p className="mt-1 font-mono text-[10px] text-red-400">{errors.message}</p>}
                </div>
              </div>

              {/* Status messages */}
              {status.type === "success" && (
                <div className="mt-6 rounded-sm border border-emerald-700/30 bg-emerald-900/20 p-4">
                  <p className="font-mono text-sm text-emerald-400">✓ {status.message}</p>
                </div>
              )}
              {status.type === "error" && (
                <div className="mt-6 rounded-sm border border-red-700/30 bg-red-900/20 p-4">
                  <p className="font-mono text-sm text-red-400">✗ {status.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status.type === "sending"}
                className="group mt-8 flex w-full items-center justify-center gap-3 border border-brass bg-brass px-8 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-night transition-all duration-300 hover:bg-transparent hover:text-brass disabled:opacity-50 disabled:hover:bg-brass disabled:hover:text-night"
              >
                {status.type === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-night border-t-transparent" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <IconArrow size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-sand/35">
                Réponse sous 24h · Pas de spam
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
