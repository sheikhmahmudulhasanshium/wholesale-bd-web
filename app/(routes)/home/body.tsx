// @/app/home/body.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import Sidebar from "@/app/components/common/sidebar";
import { NavMenu } from "@/app/components/common/navbar";
import { ArrowUp, FullscreenIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useLanguage } from "@/app/components/contexts/language-context";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";

import ContentMenu from "./conent-body";
import ZoneBody from "./zone-body";
import { useCollections } from "@/app/components/hooks/use-collections";
import { ProductGrid } from "./product-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeClient() {
  const { language } = useLanguage();
  const [showTopButton, setShowTopButton] = useState(false);
  const { collections, isLoading, error } = useCollections();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const bannerEle = document.getElementById("banner");
      if (!bannerEle) return;
      const bannerBottom = bannerEle.getBoundingClientRect().bottom;
      setShowTopButton(bannerBottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const renderSkeletons = () => (
    <>
      {[...Array(4)].map((_, i) => (
         <div key={i} className="w-full max-w-7xl px-8 py-10 mx-auto">
             <Skeleton className="h-96 w-full rounded-2xl" />
         </div>
      ))}
    </>
  );

  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
      navbar={<NavMenu />}
      sidebar={isMounted ? <Sidebar /> : null}
    >
      <main className="flex flex-col items-center justify-start py-6 bg-accent text-foreground relative">
        <ContentMenu language={language} id="banner" title="" isBanner={true} />

        {isLoading && renderSkeletons()}

        {error && (
            <div className="text-center py-20 text-destructive">
                <p>Failed to load collections.</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
        )}

        {collections?.map((collection) => {
          // --- START OF MODIFICATION ---
          // Check if this specific collection is the "Limited Time Offer"
          const isLimitedTimeOffer = collection.url === 'limited-time-offer';
          // --- END OF MODIFICATION ---

          return (
            <ContentMenu
              key={collection._id}
              language={language}
              id={collection.url}
              title={language === 'bn' ? collection.title_bn : collection.title}
              iconName={collection.lucide_react_icon}
              // --- START OF MODIFICATION ---
              // Only pass the endDate if it's the limited time offer collection
              endDate={isLimitedTimeOffer ? collection.end_date : undefined}
              // --- END OF MODIFICATION ---
              productCount={collection.products.length}
              content={<ProductGrid products={collection.products} language={language}/>}
            />
          );
        })}


<Link href="/products" className="w-10/12">
  <Button
    variant={'default'}
    className="
      group           {/* This is key! It allows us to style children on parent hover */}
      w-full
      h-14
      text-lg
      font-semibold
      rounded-xl
      flex
      items-center
      justify-center
      gap-3
      overflow-hidden {/* Prevents any content from spilling on scale */}
      transition-all
      duration-300
      ease-in-out
      focus:ring-2    {/* Add a focus ring for accessibility */}
      focus:ring-ring {/* Uses your theme's ring color */}
      focus:ring-offset-2 {/* Adds space between button and ring */}
      hover:scale-105   {/* Slightly enlarge the whole button on hover */}
      hover:shadow-xl   {/* Make the shadow more pronounced */}
    "
  >
    {/* The icon will rotate on button hover because of `group-hover` */}
    <FullscreenIcon className="
      h-5 w-5
      transition-transform
      duration-300
      group-hover:rotate-90
      group-hover:scale-110
    " />
    <span>
      {language === 'bn' ? 'সকল পণ্য' : 'All Products'}
    </span>
  </Button>
</Link>
        {showTopButton && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg bg-primary text-primary-foreground"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </main>
    </BasicPageProvider>
  );
}