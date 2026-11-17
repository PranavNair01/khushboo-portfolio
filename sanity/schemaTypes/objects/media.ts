import { ImageIcon } from "@sanity/icons/Image";
import { defineArrayMember, defineField, defineType } from "sanity";

// One piece of creative work: an image, a video, or a carousel of slides, plus a layout
// hint so the site knows whether to frame it as a reel, a post or a film.
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
          { title: "Carousel", value: "carousel" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slides",
      type: "array",
      description: "Drag several files in at once, then drag to reorder. Images and videos can be mixed.",
      of: [defineArrayMember({ type: "slide" })],
      options: { layout: "grid" },
      hidden: ({ parent }) => parent?.kind !== "carousel",
      validation: (rule) =>
        rule.custom((value, { parent }) =>
          (parent as { kind?: string })?.kind === "carousel" && (!value || value.length < 2)
            ? "A carousel needs at least 2 slides"
            : true,
        ),
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
      description: "How the piece is framed on the site. For a carousel, the shape of its slides.",
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
    select: {
      kind: "kind",
      format: "format",
      caption: "caption",
      image: "image",
      poster: "poster",
      slides: "slides",
      firstImage: "slides.0.image",
      firstPoster: "slides.0.poster",
    },
    prepare: ({ kind, format, caption, image, poster, slides, firstImage, firstPoster }) => {
      const label =
        kind === "carousel" ? `Carousel · ${slides?.length ?? 0} slides` : kind === "video" ? "Video" : "Image";
      return {
        title: caption || `${label} · ${format ?? ""}`,
        subtitle: caption ? label : undefined,
        media: kind === "carousel" ? (firstImage ?? firstPoster) : (image ?? poster),
      };
    },
  },
});
