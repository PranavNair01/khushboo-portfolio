// Small display helpers shared across pages.

export const pad = (n: number) => String(n).padStart(2, "0");

/** "2024–2025", or "2025–Now" for an ongoing role. */
export const yearRange = (start: string, end?: string) => `${start.slice(0, 4)}–${end ? end.slice(0, 4) : "Now"}`;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const whatsAppHref = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

/** Sanity file URLs download with a friendly name when given ?dl=. */
export const downloadHref = (url: string, filename: string) => `${url}?dl=${encodeURIComponent(filename)}`;
