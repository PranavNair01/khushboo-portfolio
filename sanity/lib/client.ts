import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Read from the live API, not Sanity's CDN: Next.js already caches every result
  // (getPortfolio), and right after a publish the CDN can still return the old data,
  // so a webhook-triggered rebuild would bake in stale content.
  useCdn: false,
});
