import { BookIcon } from "@sanity/icons/Book";
import { defineField, defineType } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "qualification",
      type: "string",
      description: "e.g. Bachelor of Mass Communication & Journalism",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "institution", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "completedDate",
      title: "Completed",
      type: "date",
      options: { dateFormat: "MM/YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      description: "Optional: specialisation, honours, projects.",
    }),
  ],
  orderings: [
    { title: "Most recent first", name: "completedDateDesc", by: [{ field: "completedDate", direction: "desc" }] },
  ],
  preview: {
    select: { title: "qualification", institution: "institution", date: "completedDate" },
    prepare: ({ title, institution, date }) => ({
      title,
      subtitle: [institution, date?.slice(0, 4)].filter(Boolean).join(" · "),
    }),
  },
});
