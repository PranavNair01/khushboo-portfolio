import { stillOf, type Brand, type SanityImage } from "@/sanity/lib/types";

export type Still = { key: string; image: SanityImage; brand: string };

// Still frames of her work (images, video posters, carousels' first slides), taken round-robin across
// brands so a handful of pieces already shows her range.
export function collectStills(brands: Brand[], limit = 24): Still[] {
  const perBrand = brands
    .filter((b) => b.presentation === "caseStudy")
    .map((b) =>
      [b.cover, ...(b.gallery ?? [])]
        .map((m) => stillOf(m))
        .filter((image): image is SanityImage => !!image)
        .map((image) => ({ key: image.asset._id, image, brand: b.name })),
    );
  const stills: Still[] = [];
  for (let i = 0; stills.length < limit && perBrand.some((list) => i < list.length); i++) {
    for (const list of perBrand) if (list[i] && stills.length < limit) stills.push(list[i]);
  }
  return stills;
}
