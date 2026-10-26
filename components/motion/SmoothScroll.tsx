"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import { lenisRef, PRELOADER_DONE, prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

// Inertial scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock.
// Also publishes scroll speed as --scroll-skew for elements marked [data-skew].
export function SmoothScroll() {
  const pathname = usePathname();
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
  // If scrolling was frozen for the navigation (e.g. the pull into the next brand),
  // release it once leftover wheel momentum has died down.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    // ScrollTrigger.refresh() restores the scroll position it saw, so reset only after it.
    ScrollTrigger.clearScrollMemory();
    ScrollTrigger.refresh();
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true, force: true });
    if (!lenis.isStopped) return;

    // Resume once the wheel/touch input has been quiet for a moment (momentum has stopped).
    let quiet: ReturnType<typeof setTimeout>;
    const resume = () => {
      clearTimeout(quiet);
      quiet = setTimeout(() => {
        window.scrollTo(0, 0);
        lenis.start();
        stopListening();
      }, 400);
    };
    const stopListening = () => {
      window.removeEventListener("wheel", resume);
      window.removeEventListener("touchmove", resume);
    };
    window.addEventListener("wheel", resume, { passive: true });
    window.addEventListener("touchmove", resume, { passive: true });
    resume();
    return () => {
      clearTimeout(quiet);
      stopListening();
    };
  }, [pathname]);

  return null;
}
