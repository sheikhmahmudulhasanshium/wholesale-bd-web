// components/language-toggle.tsx
"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "../../contexts/language-context"

const languageOptions = {
  en: {
    label: "EN",
    fullName: "English",
    flagSrc: "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
  },
  bn: {
    label: "BN",
    fullName: "বাংলা (Bangla)",
    flagSrc: "http://purecatamphetamine.github.io/country-flag-icons/3x2/BD.svg",
  },
};

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = languageOptions[language];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* This part from the previous fix is still correct for the trigger button */}
        <Button variant="outline" className="flex items-center gap-2 px-2 sm:px-3">
          <Image
            src={currentLanguage.flagSrc}
            alt={`${currentLanguage.fullName} flag`}
            width={20}
            height={15}
            className="hidden sm:block"
          />
          <span className="font-semibold text-sm">{currentLanguage.label}</span>
          <ChevronDown className="hidden sm:block h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languageOptions).map(([langCode, details]) => (
          <DropdownMenuItem
            key={langCode}
            onClick={() => setLanguage(langCode as 'en' | 'bn')}
            className="flex items-center gap-2 cursor-pointer"
          >
            {/* THE FIX: The flag inside the menu is now responsive */}
            <Image
              src={details.flagSrc}
              alt={`${details.fullName} flag`}
              width={20}
              height={15}
              className="hidden md:block" // <-- THIS IS THE CORRECTED LINE
            />
            <span>{details.fullName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}