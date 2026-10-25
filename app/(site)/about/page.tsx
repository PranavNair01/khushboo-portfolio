import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { SanityImg } from "@/components/Media";
import { downloadHref, yearRange } from "@/lib/format";
import { getPortfolio } from "@/sanity/lib/queries";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Khushboo Punjani: senior copywriter in Mumbai. Experience, education and skills.",
};

export default async function AboutPage() {
  const { about, experience, education, settings } = await getPortfolio();

  return (
    <div className={s.page}>
      <header className={s.head}>
        <span className="label">About</span>
        <h1 className={`display ${s.title}`}>
          Hello, I&rsquo;m <em>Khushboo.</em>
        </h1>
      </header>

      <section className={s.intro}>
        {about.portrait && (
          <SanityImg image={about.portrait} className={s.photo} sizes="(max-width: 700px) 100vw, 40vw" priority />
        )}
        <div className={s.bio}>{about.bio && <PortableText value={about.bio} />}</div>
      </section>

      {about.skills && about.skills.length > 0 && (
        <section className={s.section}>
          <h2 className="label">What I do</h2>
          <ul className={s.skills}>
            {about.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={s.section}>
        <h2 className="label">Experience</h2>
        <ol className={s.timeline}>
          {experience.map((e) => (
            <li key={e._id}>
              <span className="label">{yearRange(e.startDate, e.endDate)}</span>
              <div>
                <p className={s.role}>
                  {e.role}, <em>{e.company}</em>
                </p>
                {e.summary && <p className={s.summary}>{e.summary}</p>}
              </div>
              <span className={`label ${s.place}`}>{e.location}</span>
            </li>
          ))}
        </ol>
      </section>

      {education.length > 0 && (
        <section className={s.section}>
          <h2 className="label">Education</h2>
          <ol className={s.timeline}>
            {education.map((e) => (
              <li key={e._id}>
                <span className="label">{e.completedDate.slice(0, 4)}</span>
                <p className={s.role}>
                  {e.qualification}, <em>{e.institution}</em>
                </p>
                <span className={`label ${s.place}`}>{e.location}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {settings.resume && (
        <a className={s.resume} href={downloadHref(settings.resume, "Khushboo-Punjani-Resume.pdf")}>
          <span className="display">
            Download résumé <em>(PDF)</em>
          </span>
          <span className={s.resumeArrow} aria-hidden>
            ↓
          </span>
        </a>
      )}
    </div>
  );
}
