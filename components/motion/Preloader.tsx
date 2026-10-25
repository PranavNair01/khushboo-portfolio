"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PRELOADER_DONE, PRELOADER_SEEN } from "./motion";
import s from "./Preloader.module.css";

const NAME = "Khushboo Punjani";

/**
 * Runs before first paint (rendered inline by the site layout): flags <html data-preloading>
 * on the first visit of a session, so the overlay is up from the very first frame.
 * Failsafe: the flag clears itself after 6s, so the page can never stay covered
 * if the app's JavaScript fails to load.
 */
export const preloaderScript = `try{if(!sessionStorage.getItem("${PRELOADER_SEEN}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.setAttribute("data-preloading","");setTimeout(function(){d.removeAttribute("data-preloading")},6000)}}catch(e){}`;

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
