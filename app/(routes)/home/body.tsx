"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import Sidebar from "@/app/components/common/sidebar";
import { NavMenu } from "@/app/components/common/navbar";
import { ArrowUp } from "lucide-react";

import { useLanguage } from "@/app/components/contexts/language-context";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";

import ContentMenu from "./conent-body";
import ZoneBody from "./zone-body";

export default function HomeClient() {
  const { language } = useLanguage();
  const [showTopButton, setShowTopButton] = useState(false);

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

  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
      navbar={<NavMenu />}
      sidebar={<Sidebar />}
    >
      <main className="flex flex-col items-center justify-start py-6 bg-accent text-foreground relative">
        <ContentMenu language={language} variant="banner" />
        <ContentMenu language={language} variant="featured" />
        <ContentMenu language={language} variant="popular" />
        <ContentMenu language={language} variant="sale" />
        <ContentMenu language={language} variant="new" />
        <ContentMenu language={language} variant="toprated" />
        <ContentMenu language={language} variant="categories" />
        <ContentMenu language={language} variant="zone" content={<ZoneBody />} />

        {showTopButton && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </main>
    </BasicPageProvider>
  );
}
