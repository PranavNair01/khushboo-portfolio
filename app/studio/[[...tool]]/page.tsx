// The admin panel: Sanity Studio served at /studio.
// All routes under /studio are handled client-side by the Studio itself.
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
