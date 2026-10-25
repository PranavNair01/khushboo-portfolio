import { notFound } from "next/navigation";

// Always a 404, so there is no navigation to validate.
export const instant = false;

// Unknown URLs land here so the 404 renders inside the site layout (header, fonts, footer)
// instead of the bare root layout.
export default function Missing() {
  notFound();
}
