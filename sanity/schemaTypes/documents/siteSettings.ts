import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton: contact details, social links, résumé and SEO defaults.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "seo", title: "SEO & sharing" },
  ],
  fields: [
    defineField({ name: "email", type: "email", group: "contact" }),
    defineField({
      name: "phone",
      type: "string",
      group: "contact",
      description: "With country code, e.g. +91 97693 96099",
    }),
    defineField({
      name: "phoneOnWhatsApp",
      title: "Phone number is on WhatsApp",
      type: "boolean",
      group: "contact",
      initialValue: true,
    }),
    defineField({ name: "location", type: "string", group: "contact" }),
    defineField({
      name: "socials",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: ["LinkedIn", "Instagram", "Behance", "X", "Medium", "Other"] },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "url", type: "url", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "resume",
      title: "Résumé (PDF)",
      type: "file",
      group: "contact",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      group: "seo",
      initialValue: "Khushboo Punjani — Copywriter",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Shown in Google results and link previews.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "ogImage",
      title: "Link preview image",
      type: "image",
      group: "seo",
      description: "1200 × 630. Shown when the site is shared on LinkedIn, WhatsApp, etc.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
