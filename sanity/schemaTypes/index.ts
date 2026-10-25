import type { SchemaTypeDefinition } from "sanity";
import { about } from "./documents/about";
import { brand } from "./documents/brand";
import { experience } from "./documents/experience";
import { siteSettings } from "./documents/siteSettings";
import { media } from "./objects/media";

export const schemaTypes: SchemaTypeDefinition[] = [brand, experience, about, siteSettings, media];

// Documents that exist exactly once and are edited in place.
export const singletonTypes = new Set(["about", "siteSettings"]);
