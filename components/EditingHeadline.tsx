"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PRELOADER_DONE, prefersReducedMotion } from "./motion/motion";
import styles from "./EditingHeadline.module.css";

type Props = {
  lead: string;
  words: string[];
  className?: string;
  /** Class for the word that stays, e.g. to italicise or colour it. */
  finalClassName?: string;
};

// "Words that ~~sell~~ ~~stick~~ stay." A copywriter editing live: each draft word is typed
// behind a caret, struck through and dimmed; the last word is typed and kept.
// Server-rendered in its finished state, so it reads correctly without JavaScript.
export function EditingHeadline({ lead, words, className, finalClassName }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.removeAttribute("data-reveal-pending");
      return;
    }

    let tl: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      const wordEls = gsap.utils.toArray<HTMLElement>(`.${styles.word}`);
      gsap.set(wordEls, { opacity: 1 });
      gsap.set(el.querySelectorAll(`.${styles.char}`), { opacity: 0 });
      gsap.set(el.querySelectorAll(`.${styles.strike}`), { scaleX: 0 });
      gsap.set(el.querySelectorAll(`.${styles.caret}`), { opacity: 0 });

      tl = gsap.timeline({ paused: true, delay: 0.3 });
      wordEls.forEach((word, i) => {
        const chars = word.querySelectorAll(`.${styles.char}`);
        const caret = word.querySelector(`.${styles.caret}`);
        const isFinal = i === wordEls.length - 1;
        tl!
          .set(caret, { opacity: 1 })
          .to(chars, { opacity: 1, duration: 0.01, stagger: 0.075, ease: "none" })
          .to({}, { duration: 0.35 });
        if (!isFinal) {
          tl!
            .set(caret, { opacity: 0 })
            .to(word.querySelector(`.${styles.strike}`), { scaleX: 1, duration: 0.35, ease: "power3.inOut" })
            .to(word, { opacity: 0.35, duration: 0.3 }, "+=0.1");
        } else {
          // The caret blinks a few times on the kept word, then rests.
          tl!
            .to(caret, { opacity: 0, duration: 0.01, repeat: 5, yoyo: true, repeatDelay: 0.45 })
            .set(caret, { opacity: 0 });
        }
      });
    }, el);
    // Blank state is set; safe to show.
    el.removeAttribute("data-reveal-pending");

    // Start once the intro has revealed the page (or right away if there is no intro).
    const play = () => tl?.play();
    if (document.documentElement.hasAttribute("data-preloading"))
      window.addEventListener(PRELOADER_DONE, play, { once: true });
    else play();

    return () => {
      window.removeEventListener(PRELOADER_DONE, play);
      ctx.revert();
    };
  }, [lead, words]);

  const final = words.length - 1;
  return (
    <p
      ref={ref}
      className={`${styles.headline} ${className ?? ""}`}
      data-reveal-pending
      suppressHydrationWarning
    >
      <span className="visually-hidden">
        {lead} {words[final]}.
      </span>
      <span aria-hidden>{lead} </span>
      {words.map((word, i) => (
        <span
          key={word}
          aria-hidden
          className={`${styles.word} ${i === final ? (finalClassName ?? "") : styles.draft}`}
        >
          {[...(i === final ? `${word}.` : word)].map((ch, j) => (
            <span key={j} className={styles.char}>
              {ch}
            </span>
          ))}
          {i !== final && <span className={styles.strike} />}
          <span className={styles.caret} />
        </span>
      ))}
    </p>
  );
}
