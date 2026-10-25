import Image from "next/image";
import type { Media as MediaItem, SanityImage } from "@/sanity/lib/types";
import { LazyVideo } from "./LazyVideo";

type Props = {
  media: MediaItem;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Show a video's poster frame instead of the video (e.g. for small previews). */
  still?: boolean;
};

// Renders one piece of work: a responsive image, or a muted looping video with its poster.
export function Media({ media, className, sizes = "100vw", priority, still }: Props) {
  if (media.kind === "video" && media.video && !still) {
    return <LazyVideo src={media.video} poster={media.poster?.asset.url} className={className} label={media.caption} />;
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
