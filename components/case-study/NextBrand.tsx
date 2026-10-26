"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisRef, prefersReducedMotion } from "@/components/motion/motion";
import { Shared, sharedName } from "@/components/motion/PageTransition";
import s from "./NextBrand.module.css";

gsap.registerPlugin(ScrollTrigger);

type Props = { slug: string; name: string; color?: string };

// The end of a brand page pulls you into the next one: while this section is pinned, the
// next brand's colour floods up and its name grows; at the bottom the site navigates there,
// and the name morphs into that page's hero. With reduced motion it is a plain link.
export function NextBrand({ slug, name, color }: Props) {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const href = `/work/${slug}`;

  useEffect(() => {
    const section = ref.current;
    if (!section || prefersReducedMotion()) return;
    router.prefetch(href);
    section.dataset.pull = "";

    let navigated = false;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: ({ progress }) => {
              if (progress > 0.985 && !navigated) {
                navigated = true;
                // Freeze scrolling so leftover wheel momentum doesn't carry into the next page.
                lenisRef.current?.stop();
                router.push(href);
              }
            },
          },
        })
        .fromTo(`.${s.fill}`, { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0)
        .fromTo(`.${s.name}`, { scale: 0.45 }, { scale: 1, ease: "none" }, 0)
        .fromTo(`.${s.progress}`, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0)
        .to(`.${s.sticky}`, { color: "#fff", duration: 0.15, ease: "none" }, 0.45);
    }, section);

    return () => {
      ctx.revert();
      delete section.dataset.pull;
    };
  }, [href, router]);

  return (
    <section ref={ref} className={s.section} style={{ "--next": color ?? "var(--ink)" } as CSSProperties}>
      <div className={s.sticky}>
        <span className={s.fill} aria-hidden />
        <span className="label">Next brand</span>
        <Shared name={sharedName.brandName(slug)}>
          <span className={`display ${s.name}`}>{name}</span>
        </Shared>
        <div className={s.foot}>
          <span className={`label ${s.hint}`}>Keep scrolling</span>
          <span className={s.track} aria-hidden>
            <span className={s.progress} />
          </span>
          <Link href={href} className="label" data-cursor="Next">
            Go now →
          </Link>
        </div>
      </div>
    </section>
  );
}
