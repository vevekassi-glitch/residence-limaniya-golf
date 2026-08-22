import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size?: number) => ({
  width: size ?? 20,
  height: size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconKey = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="8" cy="15.5" r="4.5" />
    <circle cx="8" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    <path d="M11.5 12 20 3.5M17 6.5l2.5 2.5M14.5 9l1.8 1.8" />
  </svg>
);

export const IconBell = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 17.5h16M5.5 17.5a6.5 6.5 0 0 1 13 0" />
    <path d="M12 11v-1.5M10 7h4" />
    <path d="M8.5 17.5c0-2 1.5-3 3.5-3s3.5 1 3.5 3" />
  </svg>
);

export const IconBed = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 18v-8M3 14h18v4M3 16.5h18" />
    <path d="M6.5 11.5V9.5a1.5 1.5 0 0 1 1.5-1.5h3v3.5M11 8h5A3 3 0 0 1 21 11v3" />
  </svg>
);

export const IconLeaf = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M19 5c-8 0-13 4-13 10 0 2 .8 3.5 1.6 4C9 13 13 9 19 5Z" />
    <path d="M6 19c4-6 8-9 13-14" />
  </svg>
);

export const IconWifi = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3.5 9.5a13 13 0 0 1 17 0M6.5 13a8.5 8.5 0 0 1 11 0M9.5 16.2a4 4 0 0 1 5 0" />
    <circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPool = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M2.5 17c1.6-1.2 3.2-1.2 4.8 0s3.2 1.2 4.7 0 3.2-1.2 4.8 0 3.1 1.2 4.7 0M2.5 20.5c1.6-1.2 3.2-1.2 4.8 0s3.2 1.2 4.7 0 3.2-1.2 4.8 0 3.1 1.2 4.7 0" />
    <path d="M8 14V5.5a2 2 0 0 1 4 0M12 14V5.5a2 2 0 0 1 4 0M8 8h8M8 11.5h8" />
  </svg>
);

export const IconCar = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 16v2.5M20 16v2.5M3.5 11.5 5 7a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l1.5 4.5" />
    <path d="M3 16a1.5 1.5 0 0 1 1.5-4.5h15A1.5 1.5 0 0 1 21 16v.5H3Z" />
    <circle cx="7" cy="14" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="17" cy="14" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconSpa = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 20c-4.5 0-8-2.7-8-6 2.5.4 4.3 1.2 5.6 2.2C8.6 13.6 8 10 9.5 6.5 11.5 8.5 12.6 11 13 13.4c.9-2.4 2.6-4.4 5-5.9 1 3.6.3 7-.9 9.3 1-.6 2-1 3.9-1.3 0 2.8-3.5 4.5-9 4.5Z" />
  </svg>
);

export const IconGym = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 8v8M17 8v8M4 10v4M20 10v4M7 12h10M2 12h2M20 12h2" />
  </svg>
);

export const IconShuttle = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10.5 13.5 3 11l1.5-1.5 6.5.8 5.5-5.5c.8-.8 2.2-.8 3 0s.8 2.2 0 3l-5.5 5.5.8 6.5L13.5 21l-2.5-7.5Z" />
    <path d="M6 18l-2.5 2.5" />
  </svg>
);

export const IconDesk = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
    <path d="M9 19.5h6M12 15.5v4M8 8.5l3 2.5-3 2.5M13.5 13.5h2.5" />
  </svg>
);

export const IconResto = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5H3.5A8.5 8.5 0 0 1 12 3.5Z" />
    <path d="M5.5 15.5h13M12 12v3.5M9.5 20.5h5" />
  </svg>
);

export const IconScreen = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 5h18M5 5v10.5h14V5M12 15.5V19M8.5 19h7" />
    <path d="M9 9l2.5 2L15 8.5" />
  </svg>
);

export const IconShield = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5 5 6v6c0 4.4 3 7.4 7 8.5 4-1.1 7-4.1 7-8.5V6Z" />
    <path d="m9 11.8 2.2 2.2L15.5 9.5" />
  </svg>
);

export const IconPhone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M10.5 5.5h3M11 18.5h2" />
  </svg>
);

export const IconCard = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3 10h18M6.5 14.5H11" />
  </svg>
);

export const IconLock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconArrow = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const IconArrowUp = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 20V4M6 10l6-6 6 6" />
  </svg>
);

export const IconStar = ({ size, ...p }: P) => (
  <svg width={size ?? 16} height={size ?? 16} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8Z" />
  </svg>
);

export const IconClock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconPin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-10.3A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.7C18.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.2" />
  </svg>
);

export const IconUsers = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M15.5 6a3 3 0 0 1 0 5.4M17.5 14.8c1.6.7 2.7 2.3 3 4.7" />
  </svg>
);

export const IconRuler = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="9" width="18" height="6" rx="1" />
    <path d="M7 9v2.5M11 9v2.5M15 9v2.5M19 9v2.5" />
  </svg>
);

export const IconCopy = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M5.5 14.5A2 2 0 0 1 4.5 12V6a2 2 0 0 1 2-2h6a2 2 0 0 1 1.9 1.4" />
  </svg>
);

export const IconDownload = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 4v10M7.5 10.5 12 15l4.5-4.5M4.5 18.5h15" />
  </svg>
);

export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPlus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/* ————— Marques de paiement (dessins stylisés) ————— */

export const LogoWave = ({ size = 22, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" {...p}>
    <circle cx="16" cy="16" r="15" fill="#1DC4F0" />
    <path d="M7 13c2.2 0 2.6 6 4.5 6s2.3-8 4.5-8 2.4 8 4.5 8 2.3-6 4.5-6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" />
  </svg>
);

export const LogoOrange = ({ size = 22, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" {...p}>
    <rect x="1" y="1" width="30" height="30" rx="7" fill="#000" />
    <rect x="7" y="7" width="18" height="18" fill="#FF7900" />
  </svg>
);

export const LogoMtn = ({ size = 22, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" {...p}>
    <circle cx="16" cy="16" r="15" fill="#FFCB05" />
    <path d="M8 21V11l4 5 4-5 4 5 4-5v10" stroke="#00329A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const LogoMoov = ({ size = 22, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" {...p}>
    <circle cx="16" cy="16" r="15" fill="#0057A8" />
    <path d="M7 19c5-8 13-8 18-3-4 0-5 1-6 3-2-3-7-3-12 0Z" fill="#FFB300" />
  </svg>
);

export const LogoVisa = ({ size = 22, ...p }: P) => (
  <svg width={size * 1.9} height={size} viewBox="0 0 60 32" {...p}>
    <rect x="1" y="3" width="58" height="26" rx="5" fill="#1A1F71" />
    <text x="30" y="21.5" textAnchor="middle" fontFamily="Archivo, sans-serif" fontStyle="italic" fontWeight="800" fontSize="13" fill="#fff" letterSpacing="1">VISA</text>
  </svg>
);

export const LogoStripe = ({ size = 22, ...p }: P) => (
  <svg width={size * 1.9} height={size} viewBox="0 0 60 32" {...p}>
    <rect x="1" y="3" width="58" height="26" rx="5" fill="#635BFF" />
    <text x="30" y="21" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="700" fontSize="12" fill="#fff">stripe</text>
  </svg>
);

export const METHOD_LOGOS: Record<string, (p: P) => React.ReactElement> = {
  wave: LogoWave,
  orange: LogoOrange,
  mtn: LogoMtn,
  moov: LogoMoov,
  visa: LogoVisa,
  stripe: LogoStripe,
};

const AMENITY_ICONS: Record<string, (p: P) => React.ReactElement> = {
  pool: IconPool,
  resto: IconResto,
  spa: IconSpa,
  shuttle: IconShuttle,
  wifi: IconWifi,
  car: IconCar,
  gym: IconGym,
  bell: IconBell,
  desk: IconDesk,
  leaf: IconLeaf,
};

export function AmenityIcon({ name, ...p }: P & { name: string }) {
  const C = AMENITY_ICONS[name] ?? IconLeaf;
  return <C {...p} />;
}
