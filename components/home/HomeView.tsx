import type { CSSProperties } from "react";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { Gallery } from "@/components/Gallery";
import { LogoMarquee } from "@/components/LogoMarquee";
import { SanityImg } from "@/components/Media";
import { PageTransition } from "@/components/motion/PageTransition";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { WorkList } from "@/components/WorkList";
import { pad } from "@/lib/format";
import { getPortfolio } from "@/sanity/lib/queries";
import { Hero, type HeroVariant } from "./Hero";
import { collectStills } from "./stills";
import s from "./HomeView.module.css";

// The home page: name and stats, logos, about, selected work, featured brand.
export async function HomeView({ variant = "plain" }: { variant?: HeroVariant }) {
  const { settings, about, brands, experience, stats } = await getPortfolio();
  const work = brands.filter((b) => b.presentation === "caseStudy");
  // The first brand in the Studio's order is the one featured here.
  const featured = work[0];
  const current = experience.find((e) => !e.endDate);

  return (
    <PageTransition>
      <div>
        <PersonJsonLd settings={settings} about={about} role={current?.role} company={current?.company} />
        <Hero
          stats={stats}
          role={current?.role}
          company={current?.company}
          location={settings.location}
          variant={variant}
          stills={variant === "plain" ? [] : collectStills(brands)}
        />

        <LogoMarquee brands={brands} />

        <section className={s.about}>
          {about.portrait && (
            <SanityImg image={about.portrait} className={s.photo} sizes="(max-width: 700px) 100vw, 40vw" />
          )}
          <div className={s.aboutText}>
            <span className="label">About</span>
            <p className={s.years}>
              <em>{stats.years}</em>
              <span className="label">
                years writing
                <br />
                for brands
              </span>
            </p>
            <div className={s.bio}>{about.bio && <PortableText value={about.bio.slice(0, 1)} />}</div>
            <Link href="/about" className={s.cta} data-cursor="Read">
              More about me <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <section className={s.work}>
          <div className={s.head}>
            <h2 className={`display ${s.h2}`}>
              Selected <em>work</em>
            </h2>
            <span className="label">({pad(work.length)})</span>
          </div>
          <WorkList brands={work} />
        </section>

        {featured && (
          <section className={s.featured} style={{ "--brand": featured.color ?? "var(--ink)" } as CSSProperties}>
            <div className={s.featuredHead}>
              <span className="label">Featured — {pad(1)}</span>
              <h2 className={`display ${s.featuredName}`}>{featured.name}</h2>
              {featured.tagline && <p className={s.tagline}>{featured.tagline}</p>}
              <Link href={`/work/${featured.slug}`} className={s.cta} data-cursor="View">
                See the work <span aria-hidden>→</span>
              </Link>
            </div>
            <Gallery
              layout="strip"
              items={[featured.cover, ...(featured.gallery ?? [])].filter((m) => m !== undefined).slice(0, 5)}
            />
          </section>
        )}
      </div>
    </PageTransition>
  );
}
