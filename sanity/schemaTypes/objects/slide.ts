import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

const isVideo = (parent: unknown) => (parent as { kind?: string } | undefined)?.kind === "video";

// One slide of a carousel post: an image or a video.
export const slide = defineType({
  name: "slide",
  title: "Slide",
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
      hidden: ({ parent }) => isVideo(parent),
      validation: (rule) => rule.custom((value, { parent }) => (!isVideo(parent) && !value ? "Add an image" : true)),
    }),
    defineField({
      name: "video",
      type: "file",
      description: "MP4 or WebM, ideally under 5 MB.",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => !isVideo(parent),
      validation: (rule) => rule.custom((value, { parent }) => (isVideo(parent) && !value ? "Add a video" : true)),
    }),
    defineField({
      name: "poster",
      type: "image",
      description: "Still frame shown while the video loads.",
      hidden: ({ parent }) => !isVideo(parent),
    }),
  ],
  preview: {
    select: { kind: "kind", image: "image", poster: "poster" },
    prepare: ({ kind, image, poster }) => ({
      title: kind === "video" ? "Video slide" : "Image slide",
      media: image ?? poster,
    }),
  },
});
