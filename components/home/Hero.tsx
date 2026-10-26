import type { Portfolio } from "@/sanity/lib/types";
import { HeroTrail } from "./HeroTrail";
import { Stats } from "./Stats";
import type { Still } from "./stills";
import s from "./Hero.module.css";

type Props = {
  stats: Portfolio["stats"];
  role?: string;
  company?: string;
  location?: string;
  /** Her work, shown as a trail behind the cursor. */
  stills: Still[];
};

export function Hero({ stats, role, company, location, stills }: Props) {
  return (
    <section className={`${s.hero} ${s.withBackdrop}`}>
      <HeroTrail stills={stills} />
      <div className={s.meta}>
        <span className="label">Portfolio — 2026</span>
        <span className="label">{role && company ? `${role}, ${company}` : "Copywriter"}</span>
        {location && <span className="label">{location}</span>}
      </div>
      <h1 className={s.name}>
        <span>Khushboo</span>
        <span className={s.indent}>Punjani</span>
      </h1>
      <Stats years={stats.years} brands={stats.brands} role={role} company={company} />
      <span className={`label ${s.scroll}`}>(Scroll)</span>
    </section>
  );
}
