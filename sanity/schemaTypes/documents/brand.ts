import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { TagIcon } from "@sanity/icons/Tag";
import { type ConditionalPropertyCallback, defineArrayMember, defineField, defineType } from "sanity";

const isLogoOnly: ConditionalPropertyCallback = ({ document }) => document?.presentation === "logoOnly";

// A client brand. Every brand appears on the logo wall; brands presented
// as a brand page also get their own page with the work.
export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "caseStudy", title: "Work" },
  ],
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "brand" }),
    defineField({
      name: "name",
      type: "string",
      group: "basics",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "basics",
      description: "The page address, e.g. /work/chilis",
      options: { source: "name", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "presentation",
      type: "string",
      group: "basics",
      options: {
        list: [
          { title: "Brand page", value: "caseStudy" },
          { title: "Logo wall only", value: "logoOnly" },
        ],
        layout: "radio",
      },
      initialValue: "caseStudy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hidden",
      title: "Hide from site",
      type: "boolean",
      group: "basics",
      description: "Keep the brand in the Studio but remove it from the site.",
      initialValue: false,
    }),
    defineField({
      name: "logo",
      type: "image",
      group: "basics",
      description:
        "SVG or transparent PNG works best. Brands without a logo (e.g. spec work) are left off the logo wall.",
    }),
    defineField({
      name: "color",
      title: "Brand colour",
      type: "color",
      group: "basics",
      description: "The brand page takes on this colour.",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "tagline",
      type: "text",
      rows: 2,
      group: "caseStudy",
      description: "One or two lines about the brand.",
      hidden: isLogoOnly,
    }),
    defineField({
      name: "categories",
      type: "array",
      group: "caseStudy",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Social media", value: "social" },
          { title: "Film", value: "film" },
          { title: "Campaign", value: "campaign" },
          { title: "CLM", value: "clm" },
          { title: "Influencer", value: "influencer" },
        ],
        layout: "grid",
      },
      hidden: isLogoOnly,
    }),
    defineField({
      name: "agency",
      type: "string",
      group: "caseStudy",
      options: { list: ["Dentsu", "PivotRoots", "Favbookshelf", "Freelance"] },
      hidden: isLogoOnly,
    }),
    defineField({
      name: "year",
      type: "number",
      group: "caseStudy",
      validation: (rule) => rule.integer().min(2015).max(2100),
      hidden: isLogoOnly,
    }),
    defineField({
      name: "role",
      title: "What Khushboo did",
      type: "text",
      rows: 3,
      group: "caseStudy",
      hidden: isLogoOnly,
    }),
    defineField({
      name: "results",
      type: "array",
      group: "caseStudy",
      description: "Optional numbers, e.g. “2.3M” · “organic reach”.",
      of: [
        defineArrayMember({
          type: "object",
          name: "result",
          fields: [
            defineField({ name: "value", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      hidden: isLogoOnly,
    }),
    defineField({
      name: "cover",
      type: "media",
      group: "caseStudy",
      description: "Shown on the work list and as the first piece on the brand page.",
      hidden: isLogoOnly,
    }),
    defineField({
      name: "gallery",
      type: "array",
      group: "caseStudy",
      description: "Drag to reorder.",
      of: [defineArrayMember({ type: "media" })],
      hidden: isLogoOnly,
    }),
  ],
  preview: {
    select: { title: "name", presentation: "presentation", agency: "agency", hidden: "hidden", logo: "logo" },
    prepare: ({ title, presentation, agency, hidden, logo }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle: [presentation === "logoOnly" ? "Logo only" : "Brand page", agency].filter(Boolean).join(" · "),
      media: logo,
    }),
  },
});
