import type { Media as MediaItem } from "@/sanity/lib/types";
import { Media } from "./Media";
import s from "./Gallery.module.css";

type Props = {
  items: MediaItem[];
  /** "strip" scrolls sideways (home teaser); "grid" lays everything out (case study page). */
  layout?: "strip" | "grid";
};

// Each piece keeps its real proportions: reels tall, films wide.
export function Gallery({ items, layout = "grid" }: Props) {
  return (
    <div className={s[layout]}>
      {items.map((m, i) => (
        <figure key={m._key ?? i} className={`${s.item} ${s[m.format]}`}>
          <div className={s.frame}>
            <Media media={m} className={s.media} sizes={layout === "strip" ? "(max-width: 700px) 70vw, 25vw" : "(max-width: 700px) 100vw, 33vw"} />
          </div>
          {m.caption && <figcaption className="label">{m.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
