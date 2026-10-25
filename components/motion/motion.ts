// Shared constants and handles for the motion layer.
import type Lenis from "lenis";

/** Fired on window when the intro has finished and the page is revealed. */
export const PRELOADER_DONE = "kp:preloader-done";

/** sessionStorage key: the intro plays once per browser session. */
export const PRELOADER_SEEN = "kp-intro-seen";

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on devices with a mouse or trackpad (custom cursor and magnetic effects make sense). */
export const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** The page's smooth-scroll instance (null when reduced motion is on), for pausing it, e.g. under a modal. */
export const lenisRef: { current: Lenis | null } = { current: null };
