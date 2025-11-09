"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { NavMenu } from "@/app/components/common/navbar";
import { ArrowUp, FullscreenIcon, StarsIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useLanguage } from "@/app/components/contexts/language-context";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";

import ContentMenu from "./conent-body";
import { useCollections } from "@/app/components/hooks/use-collections";
import { ProductGrid } from "./product-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/app/components/common/sidebar";
import { CartButton } from "@/app/components/common/buttons/cart-button";
import { ZoneSelector } from "@/app/components/common/buttons/zone-selector";
import BecomeSeller from "@/app/components/common/buttons/become-a-seller-button";

export default function HomeClient() {
  const { language } = useLanguage();
  const [showTopButton, setShowTopButton] = useState(false);
  const { collections, isLoading, error } = useCollections();
  const [isMounted, setIsMounted] = useState(false);

  // --- 1. ADD STATE to control the sidebar from this page ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ... (rest of your useEffects and functions remain the same)
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
      // --- 2. PASS the state and setter function as props to the Sidebar ---
      sidebar={isMounted ? (
        <div className="flex w-full justify-between items-center">
            <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className="flex justify-end items-center-safe gap-2">
            {/*<Button>
              <StarsIcon/> Collections
            </Button>*/}
            <ZoneSelector/>
            <CartButton/>
            <BecomeSeller/>
          </div>
        </div>
        
      ) : null}
    >
      <main className="flex flex-col items-center justify-start py-6 bg-accent text-foreground relative">
        {/* ... The rest of your main content remains the same ... */}
        <ContentMenu language={language} id="banner" title="" isBanner={true} />
        {isLoading && renderSkeletons()}
        {error && (
            <div className="text-center py-20 text-destructive">
                <p>Failed to load collections.</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
        )}
        {collections?.map((collection) => {
          const isLimitedTimeOffer = collection.url === 'limited-time-offer';
          return (
            <ContentMenu
              key={collection._id}
              language={language}
              id={collection.url}
              title={language === 'bn' ? collection.title_bn : collection.title}
              iconName={collection.lucide_react_icon}
              endDate={isLimitedTimeOffer ? collection.end_date : undefined}
              productCount={collection.products.length}
              content={<ProductGrid products={collection.products} language={language}/>}
            />
          );
        })}
        <Link href="/products" className="w-10/12">
          <Button
            variant={'default'}
            className="group w-full h-14 text-lg font-semibold rounded-xl flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 ease-in-out focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105 hover:shadow-xl"
          >
            <FullscreenIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
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