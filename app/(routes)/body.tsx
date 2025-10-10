"use client";

import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { useLanguage } from "@/app/components/contexts/language-context";
import Sidebar from "../components/common/sidebar";
import { NavMenu } from "../components/common/navbar";

/**
 * This is a Client Component.
 * The '"use client";' directive at the top marks it as such.
 * It is necessary because it uses the 'useLanguage' hook, which relies on
 * React Context and State, both of which require browser interactivity.
 */

// Language dictionary
const translations = {
  en: {
    welcome: "Welcome to our Website!",
    description: "Use the button in the header to change the language.",
  },
  bn: {
    welcome: "আমাদের ওয়েবসাইটে স্বাগতম!",
    description: "ভাষা পরিবর্তন করতে হেডারের বোতামটি ব্যবহার করুন।",
  },
};

export default function HomeClient() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={<NavMenu/>} sidebar={<Sidebar/>}>
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl font-bold">{t.welcome}</h1>
        <p className="mt-4 text-lg">{t.description}</p>
      </main>
    </BasicPageProvider>
  );
}