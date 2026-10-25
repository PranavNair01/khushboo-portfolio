"use client";

// A script that runs during HTML parsing (before first paint) on full page loads.
// On the client it renders as inert text/plain, which stops React warning about
// rendering <script> tags; suppressHydrationWarning accepts the type difference.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
