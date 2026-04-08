"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CarDetailGalleryProps {
  images: string[];
  name: string;
}

export function CarDetailGallery({ images, name }: CarDetailGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === "ArrowLeft") {
        setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle case when images array is empty
  if (images.length === 0) {
    return (
      <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile: Single column, Desktop: Grid layout */}
      <div className="block sm:hidden">
        {/* Mobile view - All images in single column */}
        <div className="grid grid-cols-1 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-[250px] cursor-pointer rounded-xl overflow-hidden"
              onClick={() => {
                setSelectedImage(index);
                setIsLightboxOpen(true);
              }}
            >
              <Image
                src={image ? getImageUrl(image) : "/placeholder.svg"}
                alt={`${name} - Image ${index + 1}`}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
                sizes="100vw"
                priority={index === 0}
                unoptimized
              />
              {/* Image counter */}
              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {index + 1}/{images.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:block">
        <div className={`${images.length === 1 ? "" : "grid grid-cols-4 grid-rows-2 gap-2"} rounded-xl overflow-hidden h-[300px] sm:h-[400px]`}>
          {/* Single Image */}
          {images.length === 1 && (
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() => {
                setSelectedImage(0);
                setIsLightboxOpen(true);
              }}
            >
              <Image
                src={images[0] ? getImageUrl(images[0]) : "/placeholder.svg"}
                alt={`${name} - Main image`}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
                sizes="100vw"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Two Images */}
          {images.length === 2 && (
            <>
              <div
                className="col-span-2 row-span-2 relative cursor-pointer"
                onClick={() => setSelectedImage(0)}
              >
                <Image
                  src={images[0] ? getImageUrl(images[0]) : "/placeholder.svg"}
                  alt={`${name} - Image 1`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="50vw"
                  priority
                  unoptimized
                />
              </div>
              <div
                className="col-span-2 row-span-2 relative cursor-pointer"
                onClick={() => setSelectedImage(1)}
              >
                <Image
                  src={images[1] ? getImageUrl(images[1]) : "/placeholder.svg"}
                  alt={`${name} - Image 2`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="50vw"
                  unoptimized
                />
              </div>
            </>
          )}

          {/* Three Images */}
          {images.length === 3 && (
            <>
              <div
                className="col-span-2 row-span-2 relative cursor-pointer"
                onClick={() => {
                  setSelectedImage(0);
                  setIsLightboxOpen(true);
                }}
              >
                <Image
                  src={images[0] ? getImageUrl(images[0]) : "/placeholder.svg"}
                  alt={`${name} - Image 1`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="50vw"
                  priority
                  unoptimized
                />
              </div>
              <div
                className="col-span-1 row-span-1 relative cursor-pointer"
                onClick={() => {
                  setSelectedImage(1);
                  setIsLightboxOpen(true);
                }}
              >
                <Image
                  src={images[1] ? getImageUrl(images[1]) : "/placeholder.svg"}
                  alt={`${name} - Image 2`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="25vw"
                  unoptimized
                />
              </div>
              <div
                className="col-span-1 row-span-1 relative cursor-pointer"
                onClick={() => {
                  setSelectedImage(2);
                  setIsLightboxOpen(true);
                }}
              >
                <Image
                  src={images[2] ? getImageUrl(images[2]) : "/placeholder.svg"}
                  alt={`${name} - Image 3`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="25vw"
                  unoptimized
                />
              </div>
            </>
          )}

          {/* Four or More Images */}
          {images.length >= 4 && (
            <>
              <div
                className="col-span-2 row-span-2 relative cursor-pointer"
                onClick={() => {
                  setSelectedImage(0);
                  setIsLightboxOpen(true);
                }}
              >
                <Image
                  src={images[0] ? getImageUrl(images[0]) : "/placeholder.svg"}
                  alt={`${name} - Main image`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="50vw"
                  priority
                  unoptimized
                />
              </div>

              {images.slice(1, 5).map((image, index) => (
                <div
                  key={index + 1}
                  className="relative cursor-pointer"
                  onClick={() => {
                    setSelectedImage(index + 1);
                    setIsLightboxOpen(true);
                  }}
                >
                  <Image
                    src={image ? getImageUrl(image) : "/placeholder.svg"}
                    alt={`${name} - Image ${index + 2}`}
                    fill
                    className="object-cover hover:opacity-90 transition-opacity"
                    sizes="25vw"
                    unoptimized
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        +{images.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          {/* Main image */}
          <div className="relative w-full h-full flex items-center justify-center px-4">
            <Image
              src={images[selectedImage] ? getImageUrl(images[selectedImage]) : "/placeholder.svg"}
              alt={`${name} - Image ${selectedImage + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              unoptimized
            />

            {/* Previous button */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-opacity ${index === selectedImage ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                    }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <Image
                    src={image ? getImageUrl(image) : "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}