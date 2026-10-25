import type { CSSProperties } from "react";
import Link from "next/link";
import { pad } from "@/lib/format";
import { categoryLabels, type Brand } from "@/sanity/lib/types";
import { Media } from "./Media";
import s from "./WorkList.module.css";

// Magazine-style index of case studies. Hover floods the row with the brand colour
// and floats the cover next to the cursor line.
export function WorkList({ brands }: { brands: Brand[] }) {
  return (
    <ol className={s.list}>
      {brands.map((b, i) => (
        <li key={b._id} style={{ "--brand": b.color ?? "var(--ink)" } as CSSProperties}>
          <Link href={`/work/${b.slug}`} className={s.row}>
            <span className="label">{pad(i + 1)}</span>
            <span className={s.name}>{b.name}</span>
            <span className={`label ${s.cats}`}>{b.categories?.map((c) => categoryLabels[c]).join(" · ")}</span>
            <span className={s.arrow} aria-hidden>
              →
            </span>
            {b.cover && (
              <span className={s.preview} aria-hidden>
                <Media media={b.cover} className={s.previewMedia} sizes="220px" still />
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
