import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton: everything about Khushboo herself.
export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "headline",
      type: "object",
      description: "The home page line that rewrites itself, e.g. “Words that” + sell / stick / stay.",
      fields: [
        defineField({ name: "lead", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "words",
          type: "array",
          description: "Shown in order; the last word is the one that stays.",
          of: [defineArrayMember({ type: "string" })],
          validation: (rule) => rule.min(2).max(6),
        }),
      ],
    }),
    defineField({
      name: "bio",
      type: "array",
      of: [defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [] })],
    }),
    defineField({
      name: "portrait",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "skills",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});
