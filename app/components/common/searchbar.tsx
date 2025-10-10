'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchResultPreview } from "../modals/search-results-preview";

export function ResponsiveSearchBar({
  breakpointAdjustPercent = 0,
}: {
  breakpointAdjustPercent?: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
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
    if (!query.trim()) return;

    setSubmittedQuery(query.trim());
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClosePreview = () => {
    setSubmittedQuery("");
  };

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

      {/* Search Result Preview (always positioned under input/modal) */}
      {submittedQuery && (
        <SearchResultPreview query={submittedQuery} onClose={handleClosePreview} />
      )}
    </div>
  );
}
