"use client";

// next/image loader: Sanity's CDN resizes and re-encodes on the fly,
// so we skip Next's optimizer and ask the CDN for the exact width.
export default function sanityImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 80));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
