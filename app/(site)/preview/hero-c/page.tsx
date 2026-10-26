import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";

// Temporary: preview of hero option C — cursor trail. Delete once a direction is chosen.
export const metadata: Metadata = { title: "Preview: hero C — cursor trail", robots: { index: false } };

export default function HeroPreview() {
  return <HomeView variant="trail" />;
}
