import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

// One piece of creative work: an image or a video, plus a layout hint
// so the site knows whether to frame it as a reel, a post or a film.
export const media = defineType({
  name: "media",
  title: "Media",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "kind",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for screen readers and search engines.",
        }),
      ],
      hidden: ({ parent }) => parent?.kind !== "image",
      validation: (rule) =>
        rule.custom((value, { parent }) =>
          (parent as { kind?: string })?.kind === "image" && !value ? "Add an image" : true,
        ),
    }),
    defineField({
      name: "video",
      type: "file",
      description: "MP4 or WebM, ideally under 5 MB.",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => parent?.kind !== "video",
      validation: (rule) =>
        rule.custom((value, { parent }) =>
          (parent as { kind?: string })?.kind === "video" && !value ? "Add a video" : true,
        ),
    }),
    defineField({
      name: "poster",
      type: "image",
      description: "Still frame shown while the video loads.",
      hidden: ({ parent }) => parent?.kind !== "video",
    }),
    defineField({
      name: "format",
      type: "string",
      description: "How the piece is framed on the site.",
      options: {
        list: [
          { title: "Reel / story (9:16)", value: "reel" },
          { title: "Portrait post (4:5)", value: "portrait" },
          { title: "Square post (1:1)", value: "square" },
          { title: "Landscape / film (16:9)", value: "landscape" },
        ],
      },
      initialValue: "reel",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      type: "string",
    }),
  ],
  preview: {
    select: { kind: "kind", format: "format", caption: "caption", image: "image", poster: "poster" },
    prepare: ({ kind, format, caption, image, poster }) => ({
      title: caption || `${kind === "video" ? "Video" : "Image"} · ${format ?? ""}`,
      media: image ?? poster,
    }),
  },
});
