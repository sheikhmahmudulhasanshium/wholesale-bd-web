// @/app/components/common/searchbar.tsx
'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // --- V NEW ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// SearchResultPreview is no longer needed here
// import { SearchResultPreview } from "../modals/search-results-preview";

export function ResponsiveSearchBar({
  breakpointAdjustPercent = 0,
}: {
  breakpointAdjustPercent?: number;
}) {
  const router = useRouter(); // --- V NEW ---
  const searchParams = useSearchParams(); // --- V NEW ---

  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- V MODIFIED: Initialize query from URL ---
  const [query, setQuery] = useState(searchParams.get('q') || "");
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseBreakpointPx = 540;
  const adjustment = baseBreakpointPx * (breakpointAdjustPercent / 100);
  const finalBreakpoint = Math.round(baseBreakpointPx + adjustment);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= finalBreakpoint);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [finalBreakpoint]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    // --- V MODIFIED: Navigate to search page ---
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setIsModalOpen(false); // Close modal on mobile after search
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  // This effect ensures the input updates if the user navigates back/forward
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const searchInputUI = (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Input
        type="search"
        placeholder="Search for products..."
        value={query}
        onChange={handleInputChange}
        className="pr-14"
      />
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 text-primary-foreground hover:bg-primary/90 m-0 p-0"
        aria-label="Search"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
    </form>
  );

  const renderMobileModal = (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b p-2 px-4 flex items-center justify-between h-16 shadow">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src={"/logo/logo.svg"}
          alt="Wholesale BD Logo"
          width={170}
          height={40}
          priority
        />
      </Link>
      <div className="flex-1 max-w-md ml-4">{searchInputUI}</div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-md lg:max-w-lg">
      {isDesktop ? (
        <div className="w-full">{searchInputUI}</div>
      ) : (
        <>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            size="icon"
            aria-label="Open search"
            className="p-0 m-0"
          >
            <SearchIcon className="h-6 w-6" />
          </Button>
          {isModalOpen && renderMobileModal}
        </>
      )}
      {/* The SearchResultPreview component is removed as we navigate to a new page */}
    </div>
  );
}