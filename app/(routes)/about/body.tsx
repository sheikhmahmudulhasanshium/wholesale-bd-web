"use client";

import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import About from "./about";
import { useEffect, useState } from "react";
//import Sidebar from "../components/common/sidebar";
//import { NavMenu } from "../components/common/navbar";

/**
 * This is a Client Component.
 * The '"use client";' directive at the top marks it as such.
 * It is necessary because it uses the 'useLanguage' hook, which relies on
 * React Context and State, both of which require browser interactivity.
 */



export default function AboutClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // During SSR and hydration, render nothing or a placeholder
    return null; 
  }
 
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} >
      <About/>
    </BasicPageProvider>
  );
}