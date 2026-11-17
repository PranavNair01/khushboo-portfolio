import type { SchemaTypeDefinition } from "sanity";
import { about } from "./documents/about";
import { brand } from "./documents/brand";
import { education } from "./documents/education";
import { experience } from "./documents/experience";
import { siteSettings } from "./documents/siteSettings";
import { media } from "./objects/media";
import { slide } from "./objects/slide";

export const schemaTypes: SchemaTypeDefinition[] = [brand, experience, education, about, siteSettings, media, slide];

// Documents that exist exactly once and are edited in place.
export const singletonTypes = new Set(["about", "siteSettings"]);
