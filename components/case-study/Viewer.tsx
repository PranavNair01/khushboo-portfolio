"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "gsap";
import { SanityImg } from "@/components/Media";
import { lenisRef, prefersReducedMotion } from "@/components/motion/motion";
import { pad } from "@/lib/format";
import type { Media as MediaItem, Slide } from "@/sanity/lib/types";
import s from "./Viewer.module.css";

type Props = {
  items: MediaItem[];
  start: number;
  /** For a carousel: the slide to open on. */
  startSlide?: number;
  /** The clicked thumbnail: the piece grows out of it, and focus returns to it on close. */
  trigger: HTMLElement;
  onClose: () => void;
};

const ZOOM = 2.5;

const slidesOf = (m: MediaItem) => (m.kind === "carousel" ? (m.slides ?? []) : []);

// Fullscreen viewer on a native modal <dialog> (focus trap and Esc for free).
// Pieces always fit the screen; click an image to zoom in and look around.
// Arrows / ← → keys / swipe move through a carousel's slides first, then between pieces.
export function Viewer({ items, start, startSlide = 0, trigger, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ index: start, slide: startSlide });
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const item = items[pos.index];
  const slides = slidesOf(item);
  const piece: MediaItem | Slide = slides.length ? slides[pos.slide] : item;

  const go = useCallback(
    (step: number) => {
      setZoom(null);
      setPos(({ index, slide }) => {
        const count = slidesOf(items[index]).length;
        if (count && slide + step >= 0 && slide + step < count) return { index, slide: slide + step };
        const next = (index + step + items.length) % items.length;
        const nextCount = slidesOf(items[next]).length;
        // Going back lands on a carousel's last slide, like flicking back through a feed.
        return { index: next, slide: step < 0 && nextCount ? nextCount - 1 : 0 };
      });
    },
    [items],
  );

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
    if (!dialog.open) dialog.showModal();
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";

    // Scoped so cleanup reverts it: a re-run (React Strict Mode) then measures the
    // stage at rest instead of mid-animation.
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
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
    });
    return () => {
      ctx.revert();
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

  // Swipe on touch screens (off while zoomed, when dragging pans instead).
  const swipeStart = useRef<number | null>(null);
  const onPointerDown = (e: ReactPointerEvent) => (swipeStart.current = e.clientX);
  const onPointerUp = (e: ReactPointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (!zoom && Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  // Zoom: the point under the pointer stays put, and moving the pointer looks around.
  const pointAt = (e: ReactPointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };
  const toggleZoom = (e: ReactPointerEvent<HTMLElement>) => {
    // Read the point now: the event's currentTarget is gone by the time a state updater runs.
    const point = pointAt(e);
    setZoom((z) => (z ? null : point));
  };
  const pan = (e: ReactPointerEvent<HTMLElement>) => zoom && setZoom(pointAt(e));

  const isVideo = piece.kind === "video" && !!piece.video;
  const image = !isVideo ? (piece.image ?? piece.poster) : undefined;

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
          {pad(pos.index + 1)} / {pad(items.length)}
        </span>
        <button className={`label ${s.close}`} onClick={close} data-cursor="Close" autoFocus>
          Close ✕
        </button>
      </div>

      <div ref={stageRef} className={s.stage} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {/* Keyed so each piece mounts fresh (videos restart, images fade in). */}
        <div key={`${pos.index}-${pos.slide}`} className={s.piece}>
          {isVideo ? (
            <video
              className={s.media}
              src={piece.video}
              poster={piece.poster?.asset.url}
              controls
              autoPlay
              playsInline
              loop
            />
          ) : (
            image && (
              <button
                className={s.zoomable}
                onPointerUp={(e) => Math.abs(e.clientX - (swipeStart.current ?? e.clientX)) < 8 && toggleZoom(e)}
                onPointerMove={pan}
                data-zoomed={!!zoom}
                data-cursor={zoom ? "Zoom out" : "Zoom in"}
                aria-label={zoom ? "Zoom out" : "Zoom in"}
              >
                <SanityImg
                  image={image}
                  className={s.media}
                  sizes="(max-width: 700px) 250vw, 200vw"
                  alt={item.caption}
                  style={zoom ? { transform: `scale(${ZOOM})`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                />
              </button>
            )
          )}
        </div>
      </div>

      <div className={s.bottom}>
        <button className={s.nav} onClick={() => go(-1)} aria-label="Previous" data-cursor="Prev">
          ←
        </button>
        <div className={s.info}>
          <p className="label">{item.caption}</p>
          {slides.length > 0 && (
            <div className={s.slides}>
              <span className="label">
                Slide {pos.slide + 1} / {slides.length}
              </span>
              <span className={s.dots}>
                {slides.map((sl, i) => (
                  <button
                    key={sl._key}
                    className={s.dot}
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === pos.slide}
                    onClick={() => {
                      setZoom(null);
                      setPos((p) => ({ ...p, slide: i }));
                    }}
                  />
                ))}
              </span>
            </div>
          )}
        </div>
        <button className={s.nav} onClick={() => go(1)} aria-label="Next" data-cursor="Next">
          →
        </button>
      </div>
    </dialog>
  );
}
