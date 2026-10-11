"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Photo with graceful fallback: if the image fails to load, shows a warm
 * blush panel with the caption instead of a broken-image icon.
 */
interface Props {
  src?: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export default function SmartImage({
  src,
  alt,
  caption,
  className = "",
  imgClassName = "",
  sizes = "(max-width: 768px) 90vw, 600px",
  priority = false,
}: Props) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        className={`flex min-h-40 flex-col items-center justify-center gap-2 bg-blush p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-hand text-3xl text-cherry">♥</span>
        <span className="text-sm font-medium text-cocoa">{caption || alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        onError={() => setBroken(true)}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}
