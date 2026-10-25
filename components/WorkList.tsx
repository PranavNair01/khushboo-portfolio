import type { CSSProperties } from "react";
import Link from "next/link";
import { pad } from "@/lib/format";
import { categoryLabels, type Brand, type Media as MediaItem } from "@/sanity/lib/types";
import { Media } from "./Media";
import { LiquidPreview } from "./motion/LiquidPreview";
import { Shared, sharedName } from "./motion/PageTransition";
import s from "./WorkList.module.css";

// Data the WebGL preview needs to show a brand's cover: the reel itself when it's a video.
function liquidData(cover?: MediaItem) {
  if (!cover) return {};
  if (cover.kind === "video" && cover.video) {
    return {
      "data-liquid-src": cover.video,
      "data-liquid-kind": "video",
      "data-liquid-poster": cover.poster?.asset.url,
    };
  }
  const image = cover.image ?? cover.poster;
  return image ? { "data-liquid-src": `${image.asset.url}?w=640&fm=jpg&q=80`, "data-liquid-kind": "image" } : {};
}

// Magazine-style index of case studies. Hover floods the row with the brand colour and
// pours the cover in next to the cursor (WebGL on desktop, a CSS card as fallback).
export function WorkList({ brands }: { brands: Brand[] }) {
  return (
    <div className={s.wrap}>
      <ol className={s.list}>
        {brands.map((b, i) => (
          <li key={b._id} style={{ "--brand": b.color ?? "var(--ink)" } as CSSProperties}>
            <Link href={`/work/${b.slug}`} className={s.row} data-cursor="View" {...liquidData(b.cover)}>
              <span className="label">{pad(i + 1)}</span>
              <Shared name={sharedName.brandName(b.slug)}>
                <span className={s.name}>{b.name}</span>
              </Shared>
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
      <LiquidPreview />
    </div>
  );
}
