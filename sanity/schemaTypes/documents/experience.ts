import { CaseIcon } from "@sanity/icons/Case";
import { defineField, defineType } from "sanity";

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({ name: "role", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "company", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "startDate",
      type: "date",
      options: { dateFormat: "MM/YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      type: "date",
      options: { dateFormat: "MM/YYYY" },
      description: "Leave empty for the current role.",
    }),
    defineField({ name: "summary", type: "text", rows: 3 }),
  ],
  orderings: [
    { title: "Most recent first", name: "startDateDesc", by: [{ field: "startDate", direction: "desc" }] },
  ],
  preview: {
    select: { role: "role", company: "company", start: "startDate", end: "endDate" },
    prepare: ({ role, company, start, end }) => ({
      title: `${role} · ${company}`,
      subtitle: `${start?.slice(0, 7) ?? "?"} → ${end?.slice(0, 7) ?? "now"}`,
    }),
  },
});
