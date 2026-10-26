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
