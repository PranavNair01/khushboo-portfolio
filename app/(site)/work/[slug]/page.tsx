import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { pad } from "@/lib/format";
import { getPortfolio } from "@/sanity/lib/queries";
import { categoryLabels } from "@/sanity/lib/types";
import s from "./page.module.css";

async function getCaseStudy(slug: string) {
  const { brands } = await getPortfolio();
  const work = brands.filter((b) => b.presentation === "caseStudy");
  const index = work.findIndex((b) => b.slug === slug);
  if (index === -1) return null;
  return { brand: work[index], index, total: work.length, next: work[(index + 1) % work.length] };
}

export async function generateStaticParams() {
  const { brands } = await getPortfolio();
  return brands.filter((b) => b.presentation === "caseStudy").map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const found = await getCaseStudy((await params).slug);
  if (!found) return {};
  const { brand } = found;
  const cover = brand.cover?.image ?? brand.cover?.poster;
  return {
    title: brand.name,
    description: brand.tagline,
    openGraph: cover ? { images: [{ url: `${cover.asset.url}?w=1200&h=630&fit=crop` }] } : undefined,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const found = await getCaseStudy((await params).slug);
  if (!found) notFound();
  const { brand, index, total, next } = found;

  const facts = [
    { label: "Agency", value: brand.agency },
    { label: "Year", value: brand.year?.toString() },
    { label: "Work", value: brand.categories?.map((c) => categoryLabels[c]).join(", ") },
  ].filter((f) => f.value);

  const pieces = [brand.cover, ...(brand.gallery ?? [])].filter((m) => m !== undefined);

  return (
    <article style={{ "--brand": brand.color ?? "var(--ink)" } as CSSProperties}>
      <header className={s.hero}>
        <div className={s.heroTop}>
          <Link href="/work" className="label">
            ← All work
          </Link>
          <span className="label">
            Case study — {pad(index + 1)} / {pad(total)}
          </span>
        </div>
        <h1 className={`display ${s.name}`}>{brand.name}</h1>
        <div className={s.heroFoot}>
          {brand.tagline && <p className={s.tagline}>{brand.tagline}</p>}
          {facts.length > 0 && (
            <dl className={s.facts}>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="label">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      {(brand.role || brand.results?.length) && (
        <section className={s.story}>
          {brand.role && (
            <div className={s.role}>
              <span className="label">What I wrote</span>
              <p>{brand.role}</p>
            </div>
          )}
          {brand.results && brand.results.length > 0 && (
            <ul className={s.results}>
              {brand.results.map((r) => (
                <li key={r.label}>
                  <span className={`display ${s.resultValue}`}>{r.value}</span>
                  <span className="label">{r.label}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className={s.work} aria-label={`${brand.name} work`}>
        <div className={s.workHead}>
          <span className="label">The work</span>
          <span className="label">({pad(pieces.length)})</span>
        </div>
        <Gallery items={pieces} />
      </section>

      {next && next._id !== brand._id && (
        <Link
          href={`/work/${next.slug}`}
          className={s.next}
          style={{ "--next": next.color ?? "var(--ink)" } as CSSProperties}
        >
          <span className="label">Next case study</span>
          <span className={`display ${s.nextName}`}>
            {next.name} <span aria-hidden>→</span>
          </span>
        </Link>
      )}
    </article>
  );
}
