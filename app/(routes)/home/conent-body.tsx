// @/app/home/conent-body.tsx

"use client";

import React, { useRef } from "react";
import Link from 'next/link';
import { motion, useInView } from "framer-motion";
// FIX: Import LucideIcon, the specific type for a lucide icon component.
import { ChevronDown, HelpCircle, LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import * as Icons from "lucide-react";
import { ImageSlider } from "@/app/components/common/slideshow";
import CountdownTimer from "./count-down-timer";

// FIX: The function now correctly returns the `LucideIcon` type.
const getIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return HelpCircle;
  
  // FIX: Perform a safe type assertion as recommended by the error message.
  // First, cast `Icons` to `unknown`, then to an indexable record of `LucideIcon` components.
  // This tells the compiler to trust our knowledge of the module's structure.
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[iconName];
  
  return IconComponent || HelpCircle;
};

interface ContentMenuProps {
  language: "bn" | "en";
  id: string; // This 'id' is the URL slug, e.g., 'limited-time-offer'
  title: string;
  iconName?: string;
  content?: React.ReactNode;
  isBanner?: boolean;
  endDate?: string;
  productCount?: number;
}

const ContentMenu: React.FC<ContentMenuProps> = ({
  language,
  id,
  title,
  iconName,
  content,
  isBanner = false,
  endDate,
  productCount,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", amount: 0.3 });

  if (isBanner) {
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

  const Icon = getIcon(iconName);

  return (
    <motion.section
      ref={ref}
      id={id}
      className="min-h-[60svh] w-full px-4 py-10 flex justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full max-w-7xl px-4 py-6 mx-auto rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-md">
        <h2 className="flex items-center text-2xl font-semibold mb-2 gap-3 text-primary">
          <Icon className="w-7 h-7" />
          {title}
        </h2>
        
        {endDate && <CountdownTimer endDate={endDate} />}

        <div className="mt-6">
            {content ? (
                content
            ) : (
                <Skeleton
                    className="h-72 w-full rounded-md flex items-center justify-center text-lg font-medium bg-secondary text-secondary-foreground"
                >
                    {language === "bn" ? "শীঘ্রই আসছে..." : "Coming soon..."}
                </Skeleton>
            )}
        </div>
        
        <motion.div
          className="flex justify-end mt-6"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {productCount && productCount > 0 && (
            <Link
              href={`/products/collections/${id}`}
              className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground"
            >
              {language === "bn"
                ? `সব ${productCount}+ পণ্য দেখুন`
                : `See All ${productCount}+ Products`}
              <ChevronDown className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContentMenu;