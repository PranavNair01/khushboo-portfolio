"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "@/components/motion/Magnetic";
import { prefersReducedMotion } from "@/components/motion/motion";
import s from "./SkillCloud.module.css";

gsap.registerPlugin(ScrollTrigger);

// How each word looks, in turn: big and small, upright and italic, with a slight tilt.
// Repeats if there are more skills than looks.
const LOOKS = [
  { size: "xl", type: "italic", tilt: -3 },
  { size: "s", type: "mono", tilt: 2 },
  { size: "l", type: "roman", tilt: 0 },
  { size: "m", type: "italic", tilt: -1.5 },
  { size: "xl", type: "roman", tilt: 2.5 },
  { size: "s", type: "mono", tilt: -2 },
  { size: "l", type: "italic", tilt: 1 },
  { size: "m", type: "roman", tilt: 0 },
] as const;

// Skills as a word cloud: words of different sizes and styles that drift gently, rise in
// one by one when the section scrolls into view, and lean towards the cursor.
export function SkillCloud({ skills }: { skills: string[] }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // The entrance moves .rise; .word drifts (CSS) and the magnetic wrapper follows the cursor,
      // so each motion has its own element and they never fight over transform.
      gsap.from(`.${s.rise}`, {
        opacity: 0,
        y: 60,
        scale: 0.8,
        duration: 1,
        ease: "expo.out",
        stagger: { each: 0.07, from: "random" },
        scrollTrigger: { trigger: el, start: "top 80%" },
      });
    }, el);
    return () => ctx.revert();
  }, [skills]);

  return (
    <ul ref={ref} className={s.cloud}>
      {skills.map((skill, i) => {
        const look = LOOKS[i % LOOKS.length];
        return (
          <li
            key={skill}
            className={`${s.word} ${s[look.size]} ${s[look.type]}`}
            style={
              { "--tilt": `${look.tilt}deg`, "--float": `${5 + (i % 4)}s`, "--delay": `${-i * 0.7}s` } as CSSProperties
            }
          >
            <span className={s.rise}>
              <Magnetic strength={0.35}>
                <span className={s.text}>{skill}</span>
              </Magnetic>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
