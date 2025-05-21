"use client";

import Image from "next/image";
import { useState } from "react";

interface YupooImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function YupooImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
  priority = false,
}: YupooImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if it's a Yupoo image
  const isYupooImage = src.includes("photo.yupoo.com");

  if (imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">⚽</div>
          <div className="text-sm">Image not available</div>
        </div>
      </div>
    );
  }

  if (isYupooImage) {
    // Use our proxy for Yupoo images
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;

    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <Image
          src={proxyUrl}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => setImageError(true)}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">⚽</div>
              <div className="text-sm">Loading...</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For non-Yupoo images, use regular Next.js Image
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
}
