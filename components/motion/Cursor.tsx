"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { hasFinePointer, prefersReducedMotion } from "./motion";
import s from "./Cursor.module.css";

// A trailing dot that grows into a labelled disc over anything with [data-cursor="Label"],
// and into a ring over other links and buttons. Mouse/trackpad only.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const labelEl = labelRef.current;
    if (!el || !labelEl || !hasFinePointer() || prefersReducedMotion()) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.dataset.visible = "true";
    };
    const over = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, [role='button'], label");
      const text = target?.closest("input, textarea");
      if (labelled) {
        labelEl.textContent = labelled.dataset.cursor ?? "";
        el.dataset.state = "label";
      } else {
        el.dataset.state = text ? "text" : interactive ? "link" : "";
      }
    };
    const leave = () => (el.dataset.visible = "false");
    const down = () => (el.dataset.pressed = "true");
    const up = () => (el.dataset.pressed = "false");

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div ref={ref} className={s.cursor} data-visible="false" aria-hidden>
      <span ref={labelRef} className={`label ${s.label}`} />
    </div>
  );
}
