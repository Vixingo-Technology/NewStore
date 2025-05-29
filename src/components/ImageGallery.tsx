"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import YupooImage from "./YupooImage";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <YupooImage
          src={images[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          width={600}
          height={600}
          className="w-full h-auto object-contain"
          priority={currentImageIndex === 0}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-yellow-200 hover:bg-yellow-100 p-2 rounded-full shadow-md transition-colors"
            >
              <ChevronLeft className="h-5 text-gray-700 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-200 hover:bg-yellow-100 p-2 rounded-full shadow-md transition-colors"
            >
              <ChevronRight className="h-5 text-gray-700 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${index === currentImageIndex
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <YupooImage
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                width={140}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
