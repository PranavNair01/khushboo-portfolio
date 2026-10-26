"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { SanityImg } from "@/components/Media";
import { hasFinePointer, prefersReducedMotion } from "@/components/motion/motion";
import type { Still } from "./stills";
import s from "./HeroWall.module.css";

const COLUMNS = 6;

// Option B: a tilted wall of her work drifting behind her name, columns sliding in opposite
// directions, the whole wall leaning towards the cursor.
export function HeroWall({ stills }: { stills: Still[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" });
    const move = (e: PointerEvent) => {
      xTo((e.clientX / innerWidth - 0.5) * -60);
      yTo((e.clientY / innerHeight - 0.5) * -40);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const columns = Array.from({ length: COLUMNS }, (_, c) => stills.filter((_, i) => i % COLUMNS === c));

  return (
    <div className={s.backdrop} aria-hidden>
      <div ref={ref} className={s.parallax}>
        <div className={s.wall}>
          {columns.map((col, c) => (
            <div
              key={c}
              className={s.col}
              style={{ "--dur": `${48 + (c % 3) * 12}s`, "--dir": c % 2 ? "reverse" : "normal" } as CSSProperties}
            >
              {/* Two copies so the drift loops seamlessly. */}
              {[...col, ...col].map((still, i) => (
                <div key={`${still.key}-${i}`} className={s.tile}>
                  <SanityImg image={still.image} className={s.img} sizes="240px" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={s.veil} />
    </div>
  );
}
