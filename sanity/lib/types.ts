// Shapes returned by the queries in ./queries.ts (not the raw stored documents).
import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  asset: { _id: string; url: string; width: number; height: number; lqip?: string };
  alt?: string;
};

export type MediaFormat = "reel" | "portrait" | "square" | "landscape";

export type Media = {
  _key?: string;
  kind: "image" | "video";
  format: MediaFormat;
  caption?: string;
  image?: SanityImage;
  poster?: SanityImage;
  video?: string;
};

export type Category = "social" | "film" | "campaign" | "clm" | "influencer";

export type Brand = {
  _id: string;
  name: string;
  slug: string;
  presentation: "caseStudy" | "logoOnly";
  logo?: SanityImage;
  color?: string;
  tagline?: string;
  categories?: Category[];
  agency?: string;
  year?: number;
  role?: string;
  results?: { value: string; label: string }[];
  cover?: Media;
  gallery?: Media[];
};

export type Experience = {
  _id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  countsTowardsExperience?: boolean;
};

export type Education = {
  _id: string;
  qualification: string;
  institution: string;
  location?: string;
  completedDate: string;
};

export type Portfolio = {
  settings: {
    email?: string;
    phone?: string;
    phoneOnWhatsApp?: boolean;
    location?: string;
    resume?: string;
    socials?: { platform: string; url: string }[];
    title?: string;
    description?: string;
    ogImage?: string;
  };
  about: {
    bio?: PortableTextBlock[];
    portrait?: SanityImage;
    skills?: string[];
  };
  brands: Brand[];
  experience: Experience[];
  education: Education[];
  stats: { years: number; brands: number };
};

export const categoryLabels: Record<Category, string> = {
  social: "Social media",
  film: "Film",
  campaign: "Campaign",
  clm: "CLM",
  influencer: "Influencer",
};
