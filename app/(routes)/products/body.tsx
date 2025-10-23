'use client';

import Footer from "@/app/components/common/footer";
import { Header } from "@/app/components/common/header";
import { useLanguage } from "@/app/components/contexts/language-context";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import ContentMenu from "../home/conent-body";

const Body = () => {
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
        <BasicPageProvider header={<Header/>} footer={<Footer/>} navbar={null} sidebar={null}>
            
        <main className="flex flex-col items-center justify-start py-6 bg-accent text-foreground relative">
                <ContentMenu language={language} variant="banner" />
                <ContentMenu language={language} variant="all" />
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
 
export default Body;