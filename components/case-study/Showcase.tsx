"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Media } from "@/components/Media";
import { prefersReducedMotion } from "@/components/motion/motion";
import { pad } from "@/lib/format";
import type { Media as MediaItem } from "@/sanity/lib/types";
import { Viewer } from "./Viewer";
import s from "./Showcase.module.css";

gsap.registerPlugin(ScrollTrigger);

// A brand's work. On wide screens the section pins and vertical scrolling slides the
// pieces sideways, with a live counter; on phones (or with reduced motion) it's a grid.
// Any piece opens the fullscreen viewer.
export function Showcase({ items }: { items: MediaItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<{ index: number; trigger: HTMLElement } | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      section.dataset.pinned = "";
      const distance = () => track.scrollWidth - track.clientWidth;
      const pieces = track.children.length;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            if (counterRef.current)
              counterRef.current.textContent = pad(Math.min(pieces, Math.floor(progress * pieces) + 1));
            if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
          },
        },
      });
      return () => delete section.dataset.pinned;
    });
    return () => mm.revert();
  }, [items.length]);

  return (
    <section ref={sectionRef} className={s.section} aria-label="The work">
      <div className={s.head}>
        <span className="label">The work</span>
        <span className="label">
          <span className={s.current}>
            <span ref={counterRef}>01</span> /{" "}
          </span>
          {pad(items.length)}
        </span>
        <span className={s.bar}>
          <span ref={barRef} className={s.barFill} />
        </span>
      </div>

      <div ref={trackRef} className={s.track}>
        {items.map((m, i) => (
          <figure key={m._key ?? i} className={`${s.item} ${s[m.format]}`} data-skew>
            <button
              className={s.frame}
              onClick={(e) => setOpen({ index: i, trigger: e.currentTarget })}
              data-cursor={m.kind === "video" ? "Play" : "Open"}
              aria-label={`Open ${m.caption ?? `piece ${i + 1}`} fullscreen`}
            >
              <Media media={m} className={s.media} sizes="(max-width: 900px) 100vw, 30vw" />
            </button>
            {m.caption && <figcaption className="label">{m.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {open && <Viewer items={items} start={open.index} trigger={open.trigger} onClose={() => setOpen(null)} />}
    </section>
  );
}
