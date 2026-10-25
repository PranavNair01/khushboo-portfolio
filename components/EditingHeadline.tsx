import type { CSSProperties } from "react";
import styles from "./EditingHeadline.module.css";

type Props = {
  lead: string;
  words: string[];
  className?: string;
  /** Class for the word that stays, e.g. to italicise or colour it. */
  finalClassName?: string;
};

// "Words that ~~sell~~ ~~stick~~ stay." Each draft word appears, gets struck through,
// and the last one stays. CSS-only for now; GSAP takes over in build step 4.
export function EditingHeadline({ lead, words, className, finalClassName }: Props) {
  const drafts = words.slice(0, -1);
  const final = words.at(-1);
  return (
    <p className={`${styles.headline} ${className ?? ""}`} aria-label={`${lead} ${final}.`}>
      <span aria-hidden>{lead} </span>
      {drafts.map((word, i) => (
        <span key={word} aria-hidden className={styles.draft} style={{ "--i": i } as CSSProperties}>
          {word}
        </span>
      ))}
      <span aria-hidden className={`${styles.final} ${finalClassName ?? ""}`} style={{ "--i": drafts.length } as CSSProperties}>
        {final}.
      </span>
    </p>
  );
}
