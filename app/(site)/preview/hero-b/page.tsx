import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";

// Temporary: preview of hero option B — wall of work. Delete once a direction is chosen.
export const metadata: Metadata = { title: "Preview: hero B — wall of work", robots: { index: false } };

export default function HeroPreview() {
  return <HomeView variant="wall" />;
}
