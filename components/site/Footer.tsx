import Link from "next/link";
import { downloadHref, telHref, whatsAppHref } from "@/lib/format";
import type { Portfolio } from "@/sanity/lib/types";
import s from "./Footer.module.css";

export function Footer({ settings }: { settings: Portfolio["settings"] }) {
  const { email, phone, phoneOnWhatsApp, socials, resume } = settings;
  return (
    <footer className={s.footer}>
      <span className="label">Contact</span>
      <Link className={s.talk} href="/contact">
        Let&rsquo;s <em>talk.</em>
      </Link>
      <div className={s.row}>
        {email && <a href={`mailto:${email}`}>{email}</a>}
        {phone && <a href={telHref(phone)}>{phone}</a>}
        {phone && phoneOnWhatsApp && (
          <a href={whatsAppHref(phone)} target="_blank" rel="noreferrer">
            WhatsApp ↗
          </a>
        )}
        {socials?.map((so) => (
          <a key={so.url} href={so.url} target="_blank" rel="noreferrer">
            {so.platform} ↗
          </a>
        ))}
        {resume && <a href={downloadHref(resume, "Khushboo-Punjani-Resume.pdf")}>Résumé ↓</a>}
      </div>
      <div className={`label ${s.base}`}>
        <span>© Khushboo Punjani</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
