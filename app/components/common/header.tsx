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
export function Header() {
  const { isAuthenticated, isLoading } = useAuth();

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
        <ResponsiveSearchBar />
      </div>

      {/* Right Actions */}
      <nav className="flex items-center space-x-2 md:space-x-4">
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