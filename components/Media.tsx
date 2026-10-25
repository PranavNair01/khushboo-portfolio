import Image from "next/image";
import type { Media as MediaItem, SanityImage } from "@/sanity/lib/types";

type Props = {
  media: MediaItem;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

// Renders one piece of work: a responsive image, or a muted looping video with its poster.
export function Media({ media, className, sizes = "100vw", priority }: Props) {
  if (media.kind === "video" && media.video) {
    return (
      <video
        className={className}
        src={media.video}
        poster={media.poster?.asset.url}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={media.caption}
      />
    );
  }
  const image = media.image ?? media.poster;
  return image ? <SanityImg image={image} className={className} sizes={sizes} priority={priority} alt={media.caption} /> : null;
}

export function SanityImg({
  image,
  alt,
  ...rest
}: {
  image: SanityImage;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { url, width, height, lqip } = image.asset;
  return (
    <Image
      src={url}
      width={width}
      height={height}
      alt={image.alt ?? alt ?? ""}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
      {...rest}
    />
  );
}
