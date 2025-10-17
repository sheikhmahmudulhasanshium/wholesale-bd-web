"use client";

import Link from "next/link";
import Image from "next/image";
import { LanguageToggle } from "./buttons/language-toggle";
import { ModeToggle } from "./buttons/mode-toggle";
import LoginButton from "./buttons/log-in-button";
import { ResponsiveSearchBar } from "./searchbar";
import { useAuth } from "../contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { UserNav } from "./buttons/user-nav";
import { useState, useEffect } from "react"; // ADDED

export function Header() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false); // ADDED

  // ADDED: Client-side mounting check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If not mounted, render skeletons or minimal structure to prevent mismatches
  if (!isMounted) {
    return (
      <header className="relative z-50 flex h-16 items-center gap-4 border-b bg-accent px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo/logo.svg"
            alt="Wholesale BD Logo"
            width={170}
            height={40}
            priority
          />
        </Link>
        <div className="flex-1 flex w-full justify-center">
            <Skeleton className="h-9 w-full max-w-lg" />
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Skeleton className="h-9 w-12 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </header>
    );
  }


  return (
    <header className="relative z-50 flex h-16 items-center gap-4 border-b bg-accent px-4 md:px-6">
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

      {/* Search Bar */}
      <div className="flex-1 flex w-full justify-center">
        {/* ResponsiveSearchBar does not use Radix Dropdowns directly, safe to render */}
        <ResponsiveSearchBar />
      </div>

      {/* Right Actions */}
      <nav className="flex items-center space-x-2 md:space-x-4">
        {/* These components contain Radix DropdownMenu, which caused the error. 
            They are now protected by the isMounted check above. */}
        <LanguageToggle />
        <ModeToggle />
        {isLoading ? (
          <Skeleton className="h-9 w-9 rounded-full" />
        ) : isAuthenticated ? (
          <UserNav />
        ) : (
          <LoginButton />
        )}
      </nav>
    </header>
  );
}