import s from "./page.module.css";

// Shown only for brands added after the last build, while their page renders for the first time.
export default function Loading() {
  return (
    <header className={s.hero} aria-busy>
      <span className="label">Loading case study…</span>
    </header>
  );
}
