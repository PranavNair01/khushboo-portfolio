import type { CSSProperties } from "react";
import Image from "next/image";
import { stillOf, type Media as MediaItem, type SanityImage, type Slide } from "@/sanity/lib/types";
import { LazyVideo } from "./LazyVideo";

type Props = {
  media: MediaItem | Slide;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Show a video's poster frame instead of the video (e.g. for small previews). */
  still?: boolean;
};

// Renders one piece of work: a responsive image, or a muted looping video with its poster.
// A carousel shows its first slide here; the brand page's Showcase renders the full stack.
export function Media({ media, className, sizes = "100vw", priority, still }: Props) {
  const caption = "caption" in media ? media.caption : undefined;
  if (media.kind === "carousel") {
    const first = media.slides?.[0];
    return first ? <Media media={first} className={className} sizes={sizes} priority={priority} still={still} /> : null;
  }
  if (media.kind === "video" && media.video && !still) {
    return <LazyVideo src={media.video} poster={media.poster?.asset.url} className={className} label={caption} />;
  }
  const image = stillOf(media);
  return image ? (
    <SanityImg image={image} className={className} sizes={sizes} priority={priority} alt={caption} />
  ) : null;
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
  style?: CSSProperties;
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
