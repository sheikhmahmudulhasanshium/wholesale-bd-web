'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ArrowRight } from "lucide-react";

interface SearchResult {
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
}

interface SearchResultPreviewProps {
  query: string;
  onClose: () => void;
}

export function SearchResultPreview({ query, onClose }: SearchResultPreviewProps) {
  const sampleResults: SearchResult[] = [
    {
      title: "Samsung Galaxy A79",
      description: "Latest model with excellent camera and battery life.",
      href: "/product/samsung-galaxy-a79",
      imageUrl: undefined,
    },
    {
      title: "iPhone 16 Pro Max",
      description: "Apple’s flagship with powerful performance and sleek design.",
      href: "/product/iphone-16-pro-max",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR828B4tZJyQgakfNHsn0VKm3hgFYxNqc7KtA&s",
    },
    {
      title: "Oppo W12",
      description: "Affordable and stylish smartphone with good specs.",
      href: "/product/oppo-w12",
      imageUrl: undefined,
    },
  ];

  const hasResults = query.toLowerCase() === "phone";

  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (title: string) => {
    setLoadedImages((prev) => ({ ...prev, [title]: true }));
  };

  return (
    <div
      className="fixed top-16 left-0 right-0 max-h-[calc(100vh-4rem)] w-full bg-secondary border-t shadow-lg overflow-y-auto px-6 py-4 z-50"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close search results"
        className="absolute top-3 right-3 p-1 rounded-md hover:bg-accent transition"
      >
        <X className="h-5 w-5 text-muted-foreground" />
      </button>

      <p className="text-sm font-semibold text-muted-foreground mb-6">
        {hasResults
          ? `Results for '${query}' — 100+ products found`
          : `No results found for '${query}'`}
      </p>

      {hasResults ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleResults.map(({ title, description, href, imageUrl }) => {
            const fallback = "/imgnotfound.svg";
            const loaded = loadedImages[title];

            return (
              <Link
                key={title}
                href={href}
                onClick={onClose}
                className="flex flex-col bg-accent rounded-lg shadow-sm hover:shadow-md transition p-4 cursor-pointer"
              >
                <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden bg-gray-200">
                  {!loaded && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  )}
                  <Image
                    src={imageUrl || fallback}
                    alt={title}
                    fill
                    className={`object-contain transition-opacity duration-300 ${
                      loaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(title)}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-md font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-sm italic text-muted-foreground">Try another search term.</p>
      )}

      {hasResults && (
        <div className="mt-6 flex justify-end">
          <Link href={`/search?q=${query}`} onClick={onClose} passHref>
            <Button variant="link" className="inline-flex items-center space-x-1">
              <span>See all results</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
