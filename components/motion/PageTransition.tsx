import { ViewTransition, type ReactNode } from "react";

// Wrap each page's content: on navigation the old page lifts away and the new one rises in
// (styles in globals.css). Must live in page.tsx, not a layout, which never unmounts.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}

// Elements with the same name on the old and new page morph into each other,
// e.g. a brand's name in the work list becoming the brand page's title.
export function Shared({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

export const sharedName = {
  brandName: (slug: string) => `brand-name-${slug}`,
};
