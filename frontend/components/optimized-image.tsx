import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

/**
 * Optimized image component using Next.js Image for automatic compression,
 * lazy loading, and responsive sizing. Supports both fill (container-based)
 * and fixed-size images.
 */
export function OptimizedImage({
  src,
  alt,
  className = "w-full",
  fill = false,
  sizes,
  priority = false,
  width,
  height,
}: OptimizedImageProps) {
  // Skip optimization for data URLs
  if (src?.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        quality={85}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={85}
    />
  );
}
