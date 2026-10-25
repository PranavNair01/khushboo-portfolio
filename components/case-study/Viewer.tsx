"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SanityImg } from "@/components/Media";
import { lenisRef, prefersReducedMotion } from "@/components/motion/motion";
import { pad } from "@/lib/format";
import type { Media as MediaItem } from "@/sanity/lib/types";
import s from "./Viewer.module.css";

type Props = {
  items: MediaItem[];
  start: number;
  /** The clicked thumbnail: the piece grows out of it, and focus returns to it on close. */
  trigger: HTMLElement;
  onClose: () => void;
};

// Fullscreen viewer on a native modal <dialog> (focus trap and Esc for free).
// Arrows / ← → keys / swipe move between pieces; videos play with sound and controls.
export function Viewer({ items, start, trigger, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);
  const item = items[index];

  const go = useCallback((step: number) => setIndex((i) => (i + step + items.length) % items.length), [items.length]);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    const done = () => {
      onClose();
      trigger.focus({ preventScroll: true });
    };
    if (!dialog || prefersReducedMotion()) return done();
    gsap.to(dialog, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: done });
  }, [onClose, trigger]);

  // Open: freeze the page, then grow the piece out of its thumbnail.
  useEffect(() => {
    const dialog = dialogRef.current;
    const stage = stageRef.current;
    if (!dialog || !stage) return;
    dialog.showModal();
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";

    if (!prefersReducedMotion()) {
      const from = trigger.getBoundingClientRect();
      const to = stage.getBoundingClientRect();
      gsap.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: 0.35 });
      gsap.from(stage, {
        x: from.left + from.width / 2 - (to.left + to.width / 2),
        y: from.top + from.height / 2 - (to.top + to.height / 2),
        scale: from.height / to.height,
        duration: 0.8,
        ease: "expo.out",
      });
    }
    return () => {
      lenisRef.current?.start();
      document.documentElement.style.overflow = "";
    };
    // Runs once per opening; `trigger` is fixed for this viewer instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard: arrows move; Esc is handled by the dialog's cancel event below.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Swipe on touch screens.
  const swipeStart = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => (swipeStart.current = e.clientX);
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  return (
    <dialog
      ref={dialogRef}
      className={s.viewer}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      // A click on the backdrop area (the dialog itself, not its content) closes it.
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-label="Work viewer"
    >
      <div className={s.top}>
        <span className="label">
          {pad(index + 1)} / {pad(items.length)}
        </span>
        <button className={`label ${s.close}`} onClick={close} data-cursor="Close" autoFocus>
          Close ✕
        </button>
      </div>

      <div ref={stageRef} className={s.stage} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {/* Keyed so each piece mounts fresh (videos restart, images fade in). */}
        <div key={index} className={s.piece}>
          {item.kind === "video" && item.video ? (
            <video
              className={s.media}
              src={item.video}
              poster={item.poster?.asset.url}
              controls
              autoPlay
              playsInline
              loop
            />
          ) : (
            (item.image ?? item.poster) && (
              <SanityImg image={(item.image ?? item.poster)!} className={s.media} sizes="90vw" alt={item.caption} />
            )
          )}
        </div>
      </div>

      <div className={s.bottom}>
        <button className={s.nav} onClick={() => go(-1)} aria-label="Previous piece" data-cursor="Prev">
          ←
        </button>
        <p className="label">{item.caption}</p>
        <button className={s.nav} onClick={() => go(1)} aria-label="Next piece" data-cursor="Next">
          →
        </button>
      </div>
    </dialog>
  );
}
