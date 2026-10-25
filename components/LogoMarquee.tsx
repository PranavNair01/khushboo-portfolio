import type { Brand } from "@/sanity/lib/types";
import { SanityImg } from "./Media";
import s from "./LogoMarquee.module.css";

// Endless row of client logos: greyscale at rest, full colour on hover.
export function LogoMarquee({ brands }: { brands: Brand[] }) {
  const logos = brands.filter((b) => b.logo);
  return (
    <section className={s.marquee} aria-label="Brands Khushboo has written for">
      <ul className="visually-hidden">
        {logos.map((b) => (
          <li key={b._id}>{b.name}</li>
        ))}
      </ul>
      {/* Two copies so the loop is seamless; the track slides by exactly half its width. */}
      <div className={s.track} aria-hidden>
        {[...logos, ...logos].map((b, i) => (
          <SanityImg key={`${b._id}-${i}`} image={b.logo!} alt="" className={s.logo} sizes="160px" />
        ))}
      </div>
    </section>
  );
}
