import Link from "next/link";
import { PageTransition } from "@/components/motion/PageTransition";
import s from "./not-found.module.css";

export default function NotFound() {
  return (
    <PageTransition>
      <section className={s.page}>
        <span className="label">Error 404</span>
        <h1 className={`display ${s.title}`}>
          This page got <s>edited</s> <em>cut.</em>
        </h1>
        <Link href="/" className={s.link}>
          Back to the index →
        </Link>
      </section>
    </PageTransition>
  );
}
