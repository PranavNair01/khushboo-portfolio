"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { pad } from "@/lib/format";
import s from "./Header.module.css";

// Each top-level page is a "page" of the magazine, numbered like her original deck.
const pages = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const pageIndex = (pathname: string) => {
  const i = pages.findLastIndex((p) => (p.href === "/" ? pathname === "/" : pathname.startsWith(p.href)));
  return i === -1 ? 0 : i;
};

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = pageIndex(pathname);
  const close = () => setOpen(false);

  // Esc closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={s.header} data-open={open}>
      <Link href="/" className={s.mark} onClick={close} aria-label="Khushboo Punjani, home">
        K—P
      </Link>

      <nav className={s.nav} aria-label="Main">
        {pages.slice(1).map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className={s.link}
            aria-current={pathname.startsWith(p.href) ? "page" : undefined}
          >
            {p.label}
          </Link>
        ))}
      </nav>

      <span className={`label ${s.page}`}>
        Page {pad(current + 1)} / {pad(pages.length)}
      </span>

      <button
        className={`label ${s.menuButton}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? "Close" : "Menu"}
      </button>

      <div id="mobile-menu" className={s.menu} hidden={!open}>
        <ol>
          {pages.map((p, i) => (
            <li key={p.href} style={{ "--i": i } as CSSProperties}>
              <span className="label">{pad(i + 1)}</span>
              <Link href={p.href} onClick={close} aria-current={current === i ? "page" : undefined}>
                {p.label}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
