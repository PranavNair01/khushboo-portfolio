"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SanityImg } from "@/components/Media";
import { PRELOADER_DONE, prefersReducedMotion } from "@/components/motion/motion";
import type { Still } from "./stills";
import s from "./HeroTrail.module.css";

const SPACING = 90; // px of pointer travel between images

// Moving across the hero leaves a trail of her work that pops in and fades out.
// Plays one short sweep by itself on load so visitors discover it.
export function HeroTrail({ stills }: { stills: Still[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const hero = root?.parentElement;
    if (!root || !hero || prefersReducedMotion()) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(`.${s.item}`));
    let next = 0;
    let last: { x: number; y: number } | null = null;

    const spawn = (x: number, y: number) => {
      const el = items[next++ % items.length];
      gsap.killTweensOf(el);
      gsap.set(el, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        scale: 0.5,
        opacity: 1,
        rotate: gsap.utils.random(-8, 8),
        zIndex: next,
      });
      gsap.to(el, { scale: 1, duration: 0.6, ease: "expo.out" });
      gsap.to(el, { opacity: 0, scale: 0.85, duration: 0.8, delay: 0.55, ease: "power2.in" });
    };

    const move = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (last && Math.hypot(x - last.x, y - last.y) < SPACING) return;
      if (last) spawn(x, y);
      last = { x, y };
    };

    // A gentle wave across the hero, once, to show what happens.
    const sweep = () => {
      const { width, height } = hero.getBoundingClientRect();
      const steps = 9;
      for (let i = 0; i < steps; i++) {
        gsap.delayedCall(0.6 + i * 0.12, () =>
          spawn(width * (0.15 + (0.7 * i) / (steps - 1)), height * (0.4 + Math.sin(i * 0.9) * 0.12)),
        );
      }
    };

    hero.addEventListener("pointermove", move);
    if (document.documentElement.hasAttribute("data-preloading"))
      window.addEventListener(PRELOADER_DONE, sweep, { once: true });
    else sweep();
    return () => {
      hero.removeEventListener("pointermove", move);
      window.removeEventListener(PRELOADER_DONE, sweep);
      gsap.killTweensOf(items);
    };
  }, []);

  return (
    <div ref={ref} className={s.trail} aria-hidden>
      {stills.map((still) => (
        <div key={still.key} className={s.item}>
          <SanityImg image={still.image} className={s.img} sizes="260px" />
        </div>
      ))}
      <span className={`label ${s.hint}`}>Move your cursor ↝</span>
    </div>
  );
}
