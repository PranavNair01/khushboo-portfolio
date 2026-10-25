import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { telHref, whatsAppHref } from "@/lib/format";
import { getPortfolio } from "@/sanity/lib/queries";
import { ContactForm } from "./ContactForm";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Khushboo Punjani for copywriting roles and projects.",
};

export default async function ContactPage() {
  const { settings } = await getPortfolio();
  const { email, phone, phoneOnWhatsApp, location, socials } = settings;

  return (
    <PageTransition>
      <div className={s.page}>
        <header className={s.head}>
          <span className="label">Contact</span>
          <h1 className={`display ${s.title}`}>
            Say <em>hello.</em>
          </h1>
        </header>

        <div className={s.columns}>
          <dl className={s.direct}>
            {email && (
              <div>
                <dt className="label">Email</dt>
                <dd>
                  <a href={`mailto:${email}`}>{email}</a>
                </dd>
              </div>
            )}
            {phone && (
              <div>
                <dt className="label">Phone</dt>
                <dd>
                  <a href={telHref(phone)}>{phone}</a>
                  {phoneOnWhatsApp && (
                    <a href={whatsAppHref(phone)} target="_blank" rel="noreferrer" className={s.small}>
                      WhatsApp ↗
                    </a>
                  )}
                </dd>
              </div>
            )}
            {socials?.map((so) => (
              <div key={so.url}>
                <dt className="label">{so.platform}</dt>
                <dd>
                  <a href={so.url} target="_blank" rel="noreferrer">
                    {so.url.replace(/^https?:\/\/(www\.)?/, "")} ↗
                  </a>
                </dd>
              </div>
            ))}
            {location && (
              <div>
                <dt className="label">Based in</dt>
                <dd>{location}</dd>
              </div>
            )}
          </dl>

          <ContactForm />
        </div>
      </div>
    </PageTransition>
  );
}
