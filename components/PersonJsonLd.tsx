import { siteUrl } from "@/lib/site";
import type { Portfolio } from "@/sanity/lib/types";

type Props = {
  settings: Portfolio["settings"];
  about: Portfolio["about"];
  role?: string;
  company?: string;
};

// schema.org Person: helps search engines show Khushboo's name, role and profiles.
export function PersonJsonLd({ settings, about, role, company }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Khushboo Punjani",
    url: siteUrl.toString(),
    jobTitle: role ?? "Copywriter",
    ...(company && { worksFor: { "@type": "Organization", name: company } }),
    ...(settings.email && { email: `mailto:${settings.email}` }),
    ...(settings.location && { address: { "@type": "PostalAddress", addressLocality: settings.location } }),
    ...(about.portrait && { image: about.portrait.asset.url }),
    sameAs: settings.socials?.map((s) => s.url) ?? [],
    knowsAbout: about.skills ?? [],
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here except for "<", which could close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
