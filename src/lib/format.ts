export function fcfa(n: number) {
  return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " F";
}

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const DAYS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

export function fmtDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtDateShort(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function abidjanTime(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Africa/Abidjan",
  }).format(d);
}

export function buildICS(args: { title: string; from: string; to: string; ref: string; location: string; description: string }) {
  const dt = (iso: string, end = false) => {
    const base = iso.replace(/-/g, "");
    return end ? base + "T120000" : base + "T140000";
  };
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Residence Limaniya Golf//FR",
    "BEGIN:VEVENT",
    `UID:${args.ref}@limaniya-golf.ci`,
    `DTSTART:${dt(args.from)}`,
    `DTEND:${dt(args.to, true)}`,
    `SUMMARY:${args.title} — ${args.ref}`,
    `LOCATION:${args.location}`,
    `DESCRIPTION:${args.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(ics: string, filename: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
