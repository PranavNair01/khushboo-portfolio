"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion/motion";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  label?: string;
};

// Muted, looping clip that only downloads and plays while it's on screen.
// With reduced motion it stays on its poster frame (the viewer has full controls).
export function LazyVideo({ src, poster, className, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" aria-label={label} />
  );
}
