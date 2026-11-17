"use client";

import { useEffect, useRef, useState } from "react";
import { Media } from "@/components/Media";
import { hasFinePointer, prefersReducedMotion } from "@/components/motion/motion";
import type { Media as MediaItem } from "@/sanity/lib/types";
import s from "./CarouselTile.module.css";

const HOVER_STEP_MS = 1100;

// A carousel post as a stack of cards: the current slide on top, the next two peeking out
// behind, and a "1/5" badge. Swipe through it on touch screens; on hover it flips through
// the slides by itself. Exposes the slide on show as data-slide, so a click can open the
// viewer right there.
export function CarouselTile({ media, className }: { media: MediaItem; className?: string }) {
  const slides = media.slides ?? [];
  const faceRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // Keep the badge in step with swiping.
  useEffect(() => {
    const face = faceRef.current;
    if (!face) return;
    const onScroll = () => setCurrent(Math.round(face.scrollLeft / face.clientWidth));
    face.addEventListener("scroll", onScroll, { passive: true });
    return () => face.removeEventListener("scroll", onScroll);
  }, []);

  // On hover (mouse/trackpad), flip through the slides; back to the first on leave.
  useEffect(() => {
    const face = faceRef.current;
    const tile = face?.parentElement;
    if (!face || !tile || !hasFinePointer() || prefersReducedMotion() || slides.length < 2) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const show = (i: number) => face.scrollTo({ left: i * face.clientWidth, behavior: "smooth" });
    const enter = () => {
      timer = setInterval(() => {
        const next = (Math.round(face.scrollLeft / face.clientWidth) + 1) % slides.length;
        show(next);
      }, HOVER_STEP_MS);
    };
    const leave = () => {
      clearInterval(timer);
      show(0);
    };
    tile.addEventListener("pointerenter", enter);
    tile.addEventListener("pointerleave", leave);
    return () => {
      clearInterval(timer);
      tile.removeEventListener("pointerenter", enter);
      tile.removeEventListener("pointerleave", leave);
    };
  }, [slides.length]);

  // The cards behind show the next slides, so the stack reads as real content.
  const behind = [slides[1], slides[2]];

  return (
    <div className={s.tile} data-slide={current}>
      {behind.map(
        (slide, i) =>
          slide && (
            <div key={slide._key} className={`${s.card} ${s[`back${i + 1}`]}`} aria-hidden>
              <Media media={slide} className={className} sizes="20vw" still />
            </div>
          ),
      )}
      <div ref={faceRef} className={s.face}>
        {slides.map((slide, i) => (
          <div key={slide._key} className={s.slide}>
            <Media media={slide} className={className} sizes="(max-width: 900px) 100vw, 30vw" still />
            {slide.kind === "video" && (
              <span className={s.play} aria-hidden>
                ▶
              </span>
            )}
            <span className="visually-hidden">
              Slide {i + 1} of {slides.length}
            </span>
          </div>
        ))}
      </div>
      <span className={`label ${s.badge}`} aria-hidden>
        {current + 1}/{slides.length}
      </span>
    </div>
  );
}
