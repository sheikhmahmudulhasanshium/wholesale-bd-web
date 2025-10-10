'use client';
import Footer from "@/app/components/common/footer";
import { Header } from "@/app/components/common/header";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { useEffect, useState } from "react";

const Body = () => {
    const [mounted, setMounted] = useState(false);
    
      useEffect(() => {
        setMounted(true);
      }, []);
    
      if (!mounted) {
        // During SSR and hydration, render nothing or a placeholder
        return null; 
      }
     
    return (
        <BasicPageProvider header={<Header/>} footer={<Footer/>} sidebar={null} navbar={null}>
            <div>
                
                Faq body
            </div>
        </BasicPageProvider>
      );
}
 
export default Body;