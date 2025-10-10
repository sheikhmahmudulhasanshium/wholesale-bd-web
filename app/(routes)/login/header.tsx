"use client";

import Link from "next/link";
import Image from "next/image";
import { LanguageToggle } from "@/app/components/common/buttons/language-toggle";
import { ModeToggle } from "@/app/components/common/buttons/mode-toggle";

export function Header() {
  return (
    <header className="relative z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo/logo.svg"
          alt="Wholesale BD Logo"
          width={170}
          height={40}
          priority
        />
      </Link>

      

      {/* Right Actions */}
      <nav className="flex items-center space-x-2 md:space-x-4 ml-auto">
        <LanguageToggle />
        <ModeToggle />
      </nav>
    </header>
  );
}
