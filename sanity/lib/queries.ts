import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";
import { client } from "./client";
import type { Portfolio } from "./types";

const image = `{
  alt,
  asset->{ _id, url, "width": metadata.dimensions.width, "height": metadata.dimensions.height, "lqip": metadata.lqip }
}`;

const media = `{ _key, kind, format, caption, image${image}, poster${image}, "video": video.asset->url }`;

const portfolioQuery = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    email, phone, phoneOnWhatsApp, location, socials[]{ platform, url }, "resume": resume.asset->url
  },
  "about": *[_id == "about"][0]{ headline, bio, portrait${image}, skills },
  "brands": *[_type == "brand" && hidden != true] | order(orderRank) {
    _id, name, "slug": slug.current, presentation, logo${image}, "color": color.hex,
    tagline, categories, agency, year, role, results[]{ value, label },
    cover${media}, gallery[]${media}
  },
  "experience": *[_type == "experience"] | order(startDate desc) { _id, role, company, location, startDate, endDate, summary },
  "education": *[_type == "education"] | order(completedDate desc) { _id, qualification, institution, location, completedDate }
}`);

// Everything the site shows, fetched in one round trip and cached.
// Publishing in the Studio will revalidate the "sanity" tag (wired up in build step 6).
export async function getPortfolio(): Promise<Portfolio> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch<Portfolio>(portfolioQuery);
}
