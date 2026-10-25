"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import { PRELOADER_DONE, prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

// Inertial scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock.
// Also publishes scroll speed as --scroll-skew for elements marked [data-skew].
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    lenisRef.current = lenis;

    const root = document.documentElement;
    const skew = { deg: 0 };
    const setSkew = gsap.quickTo(skew, "deg", {
      duration: 0.5,
      ease: "power3",
      onUpdate: () => root.style.setProperty("--scroll-skew", `${skew.deg.toFixed(2)}deg`),
    });
    lenis.on("scroll", () => {
      ScrollTrigger.update();
      setSkew(gsap.utils.clamp(-3, 3, lenis.velocity * 0.12));
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hold scrolling while the intro plays.
    const resume = () => lenis.start();
    if (root.hasAttribute("data-preloading")) lenis.stop();
    window.addEventListener(PRELOADER_DONE, resume);

    return () => {
      window.removeEventListener(PRELOADER_DONE, resume);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page, new scroll position: jump straight to the top instead of gliding there.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
