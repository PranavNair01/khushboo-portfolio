import type { Portfolio } from "@/sanity/lib/types";
import { HeroTrail } from "./HeroTrail";
import { HeroWall } from "./HeroWall";
import { Stats } from "./Stats";
import type { Still } from "./stills";
import s from "./Hero.module.css";

export type HeroVariant = "plain" | "wall" | "trail";

type Props = {
  stats: Portfolio["stats"];
  role?: string;
  company?: string;
  location?: string;
  /** "plain": type only. "wall": a drifting wall of her work behind the name. "trail": her work trails the cursor. */
  variant?: HeroVariant;
  stills?: Still[];
};

export function Hero({ stats, role, company, location, variant = "plain", stills = [] }: Props) {
  return (
    <section className={`${s.hero} ${variant !== "plain" ? s.withBackdrop : ""}`}>
      {variant === "wall" && <HeroWall stills={stills} />}
      {variant === "trail" && <HeroTrail stills={stills} />}
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
