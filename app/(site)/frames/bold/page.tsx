import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Anton, Geist_Mono, Instrument_Serif } from "next/font/google";
import { EditingHeadline } from "@/components/EditingHeadline";
import { Media, SanityImg } from "@/components/Media";
import { getPortfolio } from "@/sanity/lib/queries";
import { categoryLabels } from "@/sanity/lib/types";
import s from "./bold.module.css";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = { title: "Style frame B — Dark & Bold" };

const pad = (n: number) => String(n).padStart(2, "0");
const brandVar = (color?: string) => ({ "--brand": color ?? "#d7ff3a" }) as CSSProperties;

export default async function BoldFrame() {
  const { settings, about, brands, experience } = await getPortfolio();
  const work = brands.filter((b) => b.presentation === "caseStudy");
  const logos = brands.filter((b) => b.logo);
  const heroReel = work.map((b) => b.cover).find((m) => m?.kind === "video");
  const current = experience.find((e) => !e.endDate);

  return (
    <div className={`${display.variable} ${serif.variable} ${mono.variable} ${s.page}`}>
      <header className={s.bar}>
        <span className={s.mark}>KP®</span>
        <span className={`${s.label} ${s.barMid}`}>
          {current ? `${current.role} — ${settings.location}` : settings.location}
        </span>
        <a className={s.pill} href="#contact">
          Let&rsquo;s talk <span className={s.dot} />
        </a>
      </header>

      <section className={s.hero}>
        <h1 className={s.name}>
          <span className={s.line}>Khushboo</span>
          <span className={s.line}>
            {heroReel && (
              <span className={s.capsule}>
                <Media media={heroReel} className={s.capsuleMedia} sizes="30vw" />
              </span>
            )}
            Punjani
          </span>
        </h1>
        <div className={s.heroFoot}>
          {about.headline && (
            <EditingHeadline
              lead={about.headline.lead}
              words={about.headline.words}
              className={s.headline}
              finalClassName={s.accent}
            />
          )}
          <p className={s.label}>
            Copy for {work.length} brands across social, film & campaigns
            <br />
            Scroll ↓
          </p>
        </div>
      </section>

      <div className={s.ticker} aria-hidden>
        <div className={s.tickerTrack}>
          {[...work, ...work].map((b, i) => (
            <span key={`${b._id}-${i}`}>
              {b.name} <i>✺</i>
            </span>
          ))}
        </div>
      </div>

      <section id="work" className={s.work}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>
            Selected <em>work</em>
          </h2>
          <span className={s.label}>({pad(work.length)})</span>
        </div>
        <ul className={s.grid}>
          {work.map((b, i) => (
            <li key={b._id} className={s.card} style={brandVar(b.color)}>
              {b.cover && <Media media={b.cover} className={s.cardMedia} sizes="(max-width: 700px) 100vw, 33vw" />}
              <span className={s.cardTint} />
              <span className={`${s.label} ${s.cardTop}`}>
                <span>{pad(i + 1)}</span>
                <span>{b.categories?.map((c) => categoryLabels[c]).join(" / ")}</span>
              </span>
              <span className={s.cardName}>{b.name}</span>
              <span className={s.cardArrow}>↗</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="about" className={s.statement}>
        <p>
          Curiosity drives me.{" "}
          {about.portrait && (
            <span className={s.inlinePhoto}>
              <SanityImg image={about.portrait} className={s.inlinePhotoImg} sizes="200px" />
            </span>
          )}{" "}
          Words <em className={s.accent}>ground</em> me. And I&rsquo;m just getting started.
        </p>
      </section>

      <section className={s.logos} aria-label="Clients">
        <span className={s.label}>Brands I&rsquo;ve written for</span>
        <ul className={s.logoGrid}>
          {logos.map((b) => (
            <li key={b._id} className={s.chip}>
              <SanityImg image={b.logo!} alt={b.name} className={s.logo} sizes="160px" />
            </li>
          ))}
        </ul>
      </section>

      <section className={s.experience}>
        <span className={s.label}>Experience</span>
        <ol>
          {experience.map((e) => (
            <li key={e._id} className={s.expRow}>
              <span className={s.expCompany}>{e.company}</span>
              <span className={s.expRole}>{e.role}</span>
              <span className={s.label}>
                {e.startDate.slice(0, 4)} — {e.endDate ? e.endDate.slice(0, 4) : "Now"}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <footer id="contact" className={s.footer}>
        <a className={s.talk} href={`mailto:${settings.email}`}>
          Let&rsquo;s talk <span className={s.talkArrow}>→</span>
        </a>
        <div className={s.contactRow}>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
          <a href={`tel:${settings.phone?.replace(/\s/g, "")}`}>{settings.phone}</a>
          {settings.socials?.map((so) => (
            <a key={so.url} href={so.url} target="_blank" rel="noreferrer">
              {so.platform} ↗
            </a>
          ))}
          {settings.resume && <a href={`${settings.resume}?dl=Khushboo-Punjani-Resume.pdf`}>Résumé ↓</a>}
        </div>
      </footer>
    </div>
  );
}
