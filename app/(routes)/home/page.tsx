"use client"

import { Header } from "@/app/components/common/header";
import { useLanguage } from "@/app/components/contexts/language-context";


// A simple dictionary for our text
const translations = {
  en: {
    welcome: "Welcome to our Website!",
    description: "Use the button in the header to change the language."
  },
  bn: {
    welcome: "আমাদের ওয়েবসাইটে স্বাগতম!",
    description: "ভাষা পরিবর্তন করতে হেডারের বোতামটি ব্যবহার করুন।"
  }
}

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language]; // Get the right text based on the current language

  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl font-bold">{t.welcome}</h1>
        <p className="mt-4 text-lg">{t.description}</p>
      </main>
    </div>
  );
}