import { EditingHeadline } from "@/components/EditingHeadline";
import type { Portfolio } from "@/sanity/lib/types";
import s from "./Hero.module.css";

type Props = {
  headline: Portfolio["about"]["headline"];
  role?: string;
  location?: string;
};

export function Hero({ headline, role, location }: Props) {
  return (
    <section className={s.hero}>
      <div className={s.meta}>
        <span className="label">Portfolio — 2026</span>
        <span className="label">{role ?? "Copywriter"}</span>
        {location && <span className="label">{location}</span>}
      </div>
      <h1 className={s.name}>
        <span>Khushboo</span>
        <span className={s.indent}>Punjani</span>
      </h1>
      {headline && (
        <EditingHeadline lead={headline.lead} words={headline.words} className={s.headline} finalClassName={s.final} />
      )}
      <span className={`label ${s.scroll}`}>(Scroll)</span>
    </section>
  );
}
