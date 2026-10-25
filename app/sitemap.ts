import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getPortfolio } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { brands } = await getPortfolio();
  const url = (path: string) => new URL(path, siteUrl).toString();
  return [
    { url: url("/"), priority: 1 },
    { url: url("/work"), priority: 0.9 },
    ...brands
      .filter((b) => b.presentation === "caseStudy")
      .map((b) => ({ url: url(`/work/${b.slug}`), priority: 0.8 })),
    { url: url("/about"), priority: 0.7 },
    { url: url("/contact"), priority: 0.6 },
  ];
}
