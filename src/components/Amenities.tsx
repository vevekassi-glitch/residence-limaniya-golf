import { AMENITIES } from "../lib/data";
import { Reveal } from "./ui";
import { AmenityIcon } from "./icons";

export default function Amenities() {
  const row = [...AMENITIES, ...AMENITIES];
  return (
    <section className="overflow-hidden border-y border-sand/10 bg-night py-14">
      <Reveal className="mx-auto mb-10 max-w-7xl px-5 md:px-8">
        <p className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
          <span className="h-px w-12 bg-brass/60" />
          Les services de la maison
        </p>
      </Reveal>

      <div className="ticker mb-4" aria-hidden="true">
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
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track rev">
          {[...row].reverse().map((a, i) => (
            <span
              key={`b-${i}`}
              className="mx-4 flex shrink-0 items-center gap-3 border border-sand/12 px-6 py-3 font-body text-sm text-sand/80 transition-colors duration-300 hover:border-brass/50 hover:text-brass"
            >
              <AmenityIcon name={a.icon} size={18} className="text-brass" />
              {a.label}
            </span>
          ))}
        </div>
      </div>

      <Reveal className="mx-auto mt-12 max-w-7xl px-5 md:px-8">
        <p className="max-w-2xl text-[15px] leading-relaxed text-mist/85">
          Tout est pensé pour que le séjour file sans accroc : la navette vous cueille à FHB,
          le linge revient le jour même, la salle de sport ne ferme jamais — et la conciergerie
          trouve des places au Plateau même un samedi soir.
        </p>
      </Reveal>
    </section>
  );
}
