"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PRELOADER_DONE, PRELOADER_SEEN } from "./motion";
import s from "./Preloader.module.css";

const NAME = "Khushboo Punjani";

/**
 * Runs before first paint (rendered inline by the site layout):
 * - <html data-motion>: motion is on, so [data-reveal-pending] elements stay hidden until
 *   their animation takes over (no flash of the end state).
 * - <html data-preloading>: first visit of the session, so the intro overlay is up from frame one.
 * Failsafe: both flags clear after 6s, so nothing stays hidden if the app's JavaScript fails.
 */
export const preloaderScript = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.setAttribute("data-motion","");if(!sessionStorage.getItem("${PRELOADER_SEEN}"))d.setAttribute("data-preloading","");setTimeout(function(){d.removeAttribute("data-preloading");d.removeAttribute("data-motion")},6000)}}catch(e){}`;

// Intro: her name sets letter by letter while a counter runs to 100, then the page
// splits open. Page animations underneath stay paused until the split starts.
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!el || !root.hasAttribute("data-preloading")) return;

    el.dataset.active = "";
    const count = { value: 0 };
    const reveal = () => {
      root.removeAttribute("data-preloading");
      window.dispatchEvent(new Event(PRELOADER_DONE));
    };
    const finish = () => {
      sessionStorage.setItem(PRELOADER_SEEN, "1");
      delete el.dataset.active;
    };

    // Scoped context: cleanup reverts every tween, so a re-run (e.g. React Strict Mode) starts clean.
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, onComplete: finish })
        .fromTo(`.${s.char}`, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.035 }, 0.2)
        .to(
          count,
          {
            value: 100,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) counterRef.current.textContent = String(Math.round(count.value)).padStart(2, "0");
            },
          },
          0,
        )
        .to(`.${s.content}`, { opacity: 0, y: -24, duration: 0.5, ease: "power2.in" }, 2.1)
        .add(reveal, 2.45)
        .to(`.${s.top}`, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.35)
        .to(`.${s.bottom}`, { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, 2.35);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={s.preloader} aria-hidden>
      <div className={s.top} />
      <div className={s.bottom} />
      <div className={s.content}>
        <p className={s.name}>
          {NAME.split(" ").map((word) => (
            <span key={word} className={s.word}>
              {[...word].map((ch, i) => (
                <span key={i} className={s.mask}>
                  <span className={s.char}>{ch}</span>
                </span>
              ))}
            </span>
          ))}
        </p>
        <div className={s.meta}>
          <span className="label">Copywriter — Portfolio 2026</span>
          <span ref={counterRef} className={`label ${s.counter}`}>
            00
          </span>
        </div>
      </div>
    </div>
  );
}
