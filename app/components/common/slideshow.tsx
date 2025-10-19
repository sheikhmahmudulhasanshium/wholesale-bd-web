"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CircleDot, Circle } from "lucide-react";
import Image from "next/image"; // Import Next.js Image component

// --- Types ---
export interface ImageSlide {
  id: string;
  imageSrc: string;
  altText: string;
  linkHref?: string;
}

interface HeroImageSliderProps {
  slides: ImageSlide[];
  interval?: number;
  autoplay?: boolean;
  showIndicators?: boolean;
  showNavigation?: boolean;
  className?: string;
  imageClassName?: string;
}

// --- Animation Variants ---

// Original slide variant
const variantsSlide: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    zIndex: 0, // Ensure entering slide starts behind
  }),
  center: {
    zIndex: 1, // Current slide always on top
    x: "0%",
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0, // Exiting slide goes behind
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

// Simpler cross-fade variant
const variantsFade: Variants = {
  enter: {
    x: "0%", // Ensure x is explicitly set for non-sliding variants
    opacity: 0,
    zIndex: 0,
  },
  center: {
    zIndex: 1,
    x: "0%",
    opacity: 1,
  },
  exit: {
    x: "0%", // Ensure x is explicitly set for non-sliding variants
    opacity: 0,
    zIndex: 0,
  },
};

// Subtle scale with fade variant
const variantsScaleLight: Variants = {
  enter: {
    x: "0%", // Ensure x is explicitly set for non-sliding variants
    scale: 0.9,
    opacity: 0,
    zIndex: 0,
  },
  center: {
    zIndex: 1,
    x: "0%",
    scale: 1,
    opacity: 1,
  },
  exit: {
    x: "0%", // Ensure x is explicitly set for non-sliding variants
    scale: 1.1,
    opacity: 0,
    zIndex: 0,
  },
};


const allVariants = [variantsSlide, variantsFade, variantsScaleLight];

export const ImageSlider: React.FC<HeroImageSliderProps> = ({
  slides,
  interval = 5000,
  autoplay = true,
  showIndicators = true,
  showNavigation = true,
  className,
  imageClassName,
}) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [currentVariants, setCurrentVariants] = useState<Variants>(variantsSlide);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = useCallback((newDirection: number) => {
    setPage(([currentPage]) => [
      (currentPage + newDirection + slides.length) % slides.length,
      newDirection,
    ]);
  }, [slides.length]); // Add slides.length to the dependency array

  const currentSlideIndex = page % slides.length;
  const currentSlide = slides[currentSlideIndex];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (autoplay) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        paginate(1);
      }, interval);
    }

    return () => {
      resetTimeout();
    };
  }, [page, autoplay, interval, paginate]); // Add paginate to dependency array

  // Randomize animation variants on page change
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * allVariants.length);
    setCurrentVariants(allVariants[randomIndex]);
  }, [page]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showNavigation) {
        if (event.key === "ArrowLeft") {
          paginate(-1);
        } else if (event.key === "ArrowRight") {
          paginate(1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNavigation, paginate]); // Add paginate to dependency array

  if (!slides || slides.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
        No slides available.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg shadow-lg aspect-[16/9] max-h-[90vh] group",
        className
      )}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide.id} // Ensure this ID is truly unique for each slide
          custom={direction}
          variants={currentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
          }}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={() => currentSlide.linkHref && window.open(currentSlide.linkHref, '_self')}
          role={currentSlide.linkHref ? "link" : "img"}
          aria-label={currentSlide.altText}
        >
          {/* Image */}
          <Image
            src={currentSlide.imageSrc}
            alt={currentSlide.altText}
            fill // Use fill to make the image cover the parent
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add appropriate sizes
            className={cn(
              "object-cover", // object-cover is equivalent to w-full h-full object-cover with fill
              imageClassName
            )}
            priority={true} // Prioritize loading of the first image
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {showNavigation && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 opacity-0 group-hover:opacity-70 focus-within:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white rounded-full"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 opacity-0 group-hover:opacity-70 focus-within:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white rounded-full"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {slides.map((_, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="icon"
              className={cn(
                "p-0 h-4 w-4 rounded-full text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40",
                {
                  "text-white bg-black/60": idx === currentSlideIndex,
                }
              )}
              onClick={(e) => { e.stopPropagation(); setPage([idx, idx > currentSlideIndex ? 1 : -1]); }}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {idx === currentSlideIndex ? (
                <CircleDot className="h-2.5 w-2.5 fill-current" />
              ) : (
                <Circle className="h-2.5 w-2.5" />
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
