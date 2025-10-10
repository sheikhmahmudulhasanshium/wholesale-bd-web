// contexts/language-context.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the type for our language options
type Language = 'en' | 'bn';

// Define the shape of the context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create the Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en'); // Default language is English

  // On component mount, try to get the language from localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['en', 'bn'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    }
  }, []);

  // Function to set language and save it to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}