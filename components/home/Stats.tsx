"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PRELOADER_DONE, prefersReducedMotion } from "@/components/motion/motion";
import s from "./Hero.module.css";

type Props = { years: number; brands: number; role?: string; company?: string };

// "3 years in copy · 15 brands · Senior Copywriter at Dentsu": the facts a recruiter
// looks for first. The numbers count up once the page is revealed.
export function Stats({ years, brands, role, company }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return el.removeAttribute("data-reveal-pending");

    const numbers = Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
    numbers.forEach((n) => (n.textContent = "0"));
    el.removeAttribute("data-reveal-pending");

    const tweens: gsap.core.Tween[] = [];
    const play = () =>
      numbers.forEach((n, i) => {
        const value = { v: 0 };
        tweens.push(
          gsap.to(value, {
            v: Number(n.dataset.count),
            duration: 1.6,
            delay: 0.5 + i * 0.15,
            ease: "power3.out",
            onUpdate: () => (n.textContent = String(Math.round(value.v))),
          }),
        );
      });
    if (document.documentElement.hasAttribute("data-preloading"))
      window.addEventListener(PRELOADER_DONE, play, { once: true });
    else play();

    return () => {
      window.removeEventListener(PRELOADER_DONE, play);
      tweens.forEach((t) => t.kill());
      numbers.forEach((n) => (n.textContent = n.dataset.count ?? ""));
    };
  }, [years, brands]);

  return (
    <p ref={ref} className={s.stats} data-reveal-pending suppressHydrationWarning>
      <span>
        <em data-count={years}>{years}</em> years in copy
      </span>
      <span aria-hidden> · </span>
      <span>
        <em data-count={brands}>{brands}</em> brands
      </span>
      {role && company && (
        <>
          <span aria-hidden> · </span>
          <span>
            {role} at <em>{company}</em>
          </span>
        </>
      )}
    </p>
  );
}
