"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Flame,
  AlarmClock,
  Sparkles,
  ThumbsUp,
  Layers,
  MapPin,
} from "lucide-react";
import { ImageSlider } from "@/app/components/common/slideshow";

export const headlines = [
  {
    key: "popular",
    en: "Popular Products",
    bn: "জনপ্রিয় পণ্য",
    Icon: Flame,
  },
  {
    key: "sale",
    en: "Limited Time Offer",
    bn: "লিমিটেড টাইম অফার",
    Icon: AlarmClock,
  },
  {
    key: "new",
    en: "Just Arrived",
    bn: "সাম্প্রতিক নতুন পণ্য",
    Icon: Sparkles,
  },
  {
    key: "toprated",
    en: "Best Quality Products",
    bn: "সেরা মানের পণ্য",
    Icon: ThumbsUp,
  },
  {
    key: "categories",
    en: "Categories",
    bn: "ক্যাটাগরি সমূহ",
    Icon: Layers,
  },
  {
    key: "zone",
    en: "Zones",
    bn: "এলাকাসমূহ",
    Icon: MapPin,
  },
];

interface ContentMenuProps {
  language: "bn" | "en";
  variant:
    | "banner"
    | "featured"
    | "popular"
    | "sale"
    | "new"
    | "toprated"
    | "categories"
    | "zone";
  content?: React.ReactNode;
}

const ContentMenu: React.FC<ContentMenuProps> = ({ language, variant, content }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", amount: 0.3 });

  if (variant === "banner") {
    return (
      <section id="banner" ref={ref} className="w-full">
        <ImageSlider
          slides={[
            { id: "1", imageSrc: "/banner/home-banner-1.png", altText: "Flash Sale" },
            { id: "2", imageSrc: "/banner/home-banner-2.png", altText: "Latest Products" },
            { id: "3", imageSrc: "/banner/home-banner-3.png", altText: "Categories" },
            { id: "4", imageSrc: "/banner/home-banner-4.png", altText: "Best Sellers" },
            { id: "5", imageSrc: "/banner/home-banner-5.png", altText: "Flash Sale" },
            { id: "6", imageSrc: "/logo/logo-3x2.png", altText: "Logo" },
          ]}
        />
      </section>
    );
  }

  const headline = headlines.find((h) => h.key === variant);
  if (!headline) return null;

  const Icon = headline.Icon;

  return (
    <motion.section
      ref={ref}
      id={variant}
      className="min-h-[60svh] w-full px-4 py-10 flex justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full max-w-7xl px-4 py-6 mx-auto rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-md">
        <h2 className="flex items-center text-2xl font-semibold mb-6 gap-3 text-primary">
          <Icon className="w-7 h-7" />
          {language === "bn" ? headline.bn : headline.en}
        </h2>

        {content ? (
          content
        ) : (
          <Skeleton
            className="h-72 w-full rounded-md flex items-center justify-center text-lg font-medium"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-secondary-foreground)",
            }}
          >
            {language === "bn" ? "শীঘ্রই আসছে..." : "Coming soon..."}
          </Skeleton>
        )}

        <motion.div className="flex justify-end mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            {language === "bn" ? "আরও দেখুন" : "See More"}
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContentMenu;
