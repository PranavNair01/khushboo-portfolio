import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/WorkIndex";
import { pad } from "@/lib/format";
import { getPortfolio } from "@/sanity/lib/queries";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies: social, film, campaigns and CLM written by Khushboo Punjani.",
};

export default async function WorkPage() {
  const { brands } = await getPortfolio();
  const work = brands.filter((b) => b.presentation === "caseStudy");
  const alsoFor = brands.filter((b) => b.presentation === "logoOnly");

  return (
    <div className={s.page}>
      <header className={s.head}>
        <h1 className={`display ${s.title}`}>
          Work<em>.</em>
        </h1>
        <span className="label">({pad(work.length)} case studies)</span>
      </header>

      <WorkIndex brands={work} />

      {alsoFor.length > 0 && (
        <section className={s.also}>
          <span className="label">Also written for</span>
          <p className={s.alsoList}>
            {alsoFor.map((b, i) => (
              <span key={b._id}>
                {b.name}
                {i < alsoFor.length - 1 && <em>, </em>}
              </span>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}
