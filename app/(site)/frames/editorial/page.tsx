import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Bodoni_Moda, Geist_Mono, Inter_Tight } from "next/font/google";
import { PortableText } from "next-sanity";
import { EditingHeadline } from "@/components/EditingHeadline";
import { Media, SanityImg } from "@/components/Media";
import { getPortfolio } from "@/sanity/lib/queries";
import { categoryLabels } from "@/sanity/lib/types";
import s from "./editorial.module.css";

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = { title: "Style frame A — Editorial" };

const pad = (n: number) => String(n).padStart(2, "0");
const brandVar = (color?: string) => ({ "--brand": color ?? "#141414" }) as CSSProperties;

export default async function EditorialFrame() {
  const { settings, about, brands, experience } = await getPortfolio();
  const work = brands.filter((b) => b.presentation === "caseStudy");
  const logos = brands.filter((b) => b.logo);
  const feature = work.find((b) => b.slug === "mmtc-pamp") ?? work[0];
  const current = experience.find((e) => !e.endDate);

  return (
    <div className={`${display.variable} ${sans.variable} ${mono.variable} ${s.page}`}>
      <header className={s.bar}>
        <span className={s.mark}>K—P</span>
        <nav className={s.nav}>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className={s.label}>Page 01 / 05</span>
      </header>

      <section className={s.hero}>
        <div className={s.heroMeta}>
          <span className={s.label}>Portfolio — 2026</span>
          <span className={s.label}>
            {current ? `${current.role}, ${current.company}` : "Copywriter"}
          </span>
          <span className={s.label}>{settings.location}</span>
        </div>
        <h1 className={s.name}>
          <span>Khushboo</span>
          <span className={s.nameIndent}>Punjani</span>
        </h1>
        {about.headline && (
          <EditingHeadline
            lead={about.headline.lead}
            words={about.headline.words}
            className={s.headline}
            finalClassName={s.headlineFinal}
          />
        )}
        <span className={`${s.label} ${s.scroll}`}>(Scroll)</span>
      </section>

      <section className={s.marquee} aria-label="Clients">
        <div className={s.marqueeTrack}>
          {[...logos, ...logos].map((b, i) => (
            <SanityImg key={`${b._id}-${i}`} image={b.logo!} alt={b.name} className={s.logo} sizes="160px" />
          ))}
        </div>
      </section>

      <section id="work" className={s.work}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>
            Selected <em>work</em>
          </h2>
          <span className={s.label}>({pad(work.length)})</span>
        </div>
        <ol className={s.list}>
          {work.map((b, i) => (
            <li key={b._id} className={s.row} style={brandVar(b.color)}>
              <span className={s.label}>{pad(i + 1)}</span>
              <span className={s.rowName}>{b.name}</span>
              <span className={`${s.label} ${s.rowCats}`}>
                {b.categories?.map((c) => categoryLabels[c]).join(" · ")}
              </span>
              <span className={s.rowArrow}>→</span>
              {b.cover && (
                <span className={s.preview}>
                  <Media media={b.cover} className={s.previewMedia} sizes="280px" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {feature && (
        <section className={s.feature} style={brandVar(feature.color)}>
          <div className={s.featureHead}>
            <span className={s.label}>Case study — {pad(work.indexOf(feature) + 1)}</span>
            <h2 className={s.featureName}>{feature.name}</h2>
            <p className={s.featureTagline}>{feature.tagline}</p>
          </div>
          <div className={s.strip}>
            {[feature.cover, ...(feature.gallery ?? [])].slice(0, 4).map(
              (m, i) =>
                m && (
                  <figure key={m._key ?? i} className={`${s.stripItem} ${s[m.format]}`}>
                    <Media media={m} className={s.stripMedia} sizes="(max-width: 700px) 70vw, 25vw" />
                    {m.caption && <figcaption className={s.label}>{m.caption}</figcaption>}
                  </figure>
                ),
            )}
          </div>
        </section>
      )}

      <section id="about" className={s.about}>
        {about.portrait && (
          <SanityImg image={about.portrait} className={s.photo} sizes="(max-width: 700px) 100vw, 40vw" />
        )}
        <div className={s.aboutText}>
          <span className={s.label}>About</span>
          <div className={s.bio}>{about.bio && <PortableText value={about.bio} />}</div>
          <ul className={s.timeline}>
            {experience.map((e) => (
              <li key={e._id}>
                <span className={s.label}>
                  {e.startDate.slice(0, 4)}–{e.endDate ? e.endDate.slice(0, 4) : "Now"}
                </span>
                <span>
                  {e.role}, <em>{e.company}</em>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer id="contact" className={s.footer}>
        <span className={s.label}>Contact</span>
        <a className={s.talk} href={`mailto:${settings.email}`}>
          Let&rsquo;s <em>talk.</em>
        </a>
        <div className={s.contactRow}>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
          <a href={`tel:${settings.phone?.replace(/\s/g, "")}`}>{settings.phone}</a>
          {settings.socials?.map((so) => (
            <a key={so.url} href={so.url} target="_blank" rel="noreferrer">
              {so.platform}
            </a>
          ))}
          {settings.resume && (
            <a href={`${settings.resume}?dl=Khushboo-Punjani-Resume.pdf`}>Résumé ↓</a>
          )}
        </div>
      </footer>
    </div>
  );
}
