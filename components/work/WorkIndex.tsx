"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Media } from "@/components/Media";
import { Shared, sharedName } from "@/components/motion/PageTransition";
import { pad } from "@/lib/format";
import { categoryLabels, type Brand, type Category } from "@/sanity/lib/types";
import s from "./WorkIndex.module.css";

// Grid of case studies with category filters. Filters only list categories that are in use.
export function WorkIndex({ brands }: { brands: Brand[] }) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const used = (Object.keys(categoryLabels) as Category[]).filter((c) => brands.some((b) => b.categories?.includes(c)));
  const shown = filter === "all" ? brands : brands.filter((b) => b.categories?.includes(filter));

  return (
    <>
      <div className={s.filters} role="group" aria-label="Filter by type of work">
        {(["all", ...used] as const).map((c) => (
          <button key={c} className={s.filter} aria-pressed={filter === c} onClick={() => setFilter(c)}>
            {c === "all" ? "All" : categoryLabels[c]}
            <sup className="label">
              {c === "all" ? brands.length : brands.filter((b) => b.categories?.includes(c)).length}
            </sup>
          </button>
        ))}
      </div>

      {/* Re-keying on the filter replays the entrance animation. */}
      <ul key={filter} className={s.grid}>
        {shown.map((b, i) => (
          <li key={b._id} style={{ "--brand": b.color ?? "var(--ink)", "--i": i } as CSSProperties}>
            <Link href={`/work/${b.slug}`} className={s.card} data-cursor="View">
              <Shared name={sharedName.brandCover(b.slug)}>
                <span className={s.frame} data-skew>
                  {b.cover && (
                    <Media media={b.cover} className={s.media} sizes="(max-width: 700px) 100vw, 33vw" still />
                  )}
                  <span className={s.tint} />
                </span>
              </Shared>
              <span className={s.meta}>
                <span className="label">{pad(brands.indexOf(b) + 1)}</span>
                <span className="label">{b.categories?.map((c) => categoryLabels[c]).join(" · ")}</span>
              </span>
              <Shared name={sharedName.brandName(b.slug)}>
                <span className={s.name}>{b.name}</span>
              </Shared>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
