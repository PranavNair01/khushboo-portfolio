import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";
import { client } from "./client";
import type { Brand, Experience, Portfolio } from "./types";

const image = `{
  alt,
  asset->{ _id, url, "width": metadata.dimensions.width, "height": metadata.dimensions.height, "lqip": metadata.lqip }
}`;

const media = `{ _key, kind, format, caption, image${image}, poster${image}, "video": video.asset->url }`;

const portfolioQuery = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    email, phone, phoneOnWhatsApp, location, socials[]{ platform, url }, "resume": resume.asset->url,
    title, description, "ogImage": ogImage.asset->url
  },
  "about": *[_id == "about"][0]{ bio, portrait${image}, skills },
  "brands": *[_type == "brand" && hidden != true] | order(orderRank) {
    _id, name, "slug": slug.current, presentation, logo${image}, "color": color.hex,
    tagline, categories, agency, year, role, results[]{ value, label },
    cover${media}, gallery[]${media}
  },
  "experience": *[_type == "experience"] | order(startDate desc) {
    _id, role, company, location, startDate, endDate, summary, countsTowardsExperience
  },
  "education": *[_type == "education"] | order(completedDate desc) { _id, qualification, institution, location, completedDate }
}`);

// Everything the site shows, fetched in one round trip and cached.
// Publishing in the Studio revalidates the "sanity" tag right away (app/api/revalidate);
// the hourly lifetime is only a safety net in case a webhook is missed.
export async function getPortfolio(): Promise<Portfolio> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  const data = await client.fetch<Omit<Portfolio, "stats">>(portfolioQuery);
  return { ...data, stats: computeStats(data.experience, data.brands) };
}

// Numbers for the home page, derived from content so they never need editing.
// Computed inside the cached function, so they refresh with every publish (and at least hourly).
function computeStats(experience: Experience[], brands: Brand[]): Portfolio["stats"] {
  const starts = experience
    .filter((e) => e.countsTowardsExperience !== false)
    .map((e) => new Date(e.startDate).getTime());
  const months = starts.length ? (Date.now() - Math.min(...starts)) / (1000 * 60 * 60 * 24 * 30.44) : 0;
  return {
    // Rounded to the nearest year, the way people state their experience (2y 10m → 3).
    years: Math.round(months / 12),
    // Every brand on the logo wall.
    brands: brands.filter((b) => b.logo).length,
  };
}
