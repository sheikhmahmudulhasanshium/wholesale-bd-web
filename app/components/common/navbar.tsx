"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/app/components/contexts/language-context";
import { mainNavLinks } from "@/lib/menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZoneSelector } from "./buttons/zone-selector";

export function NavMenu() {
  const { language } = useLanguage();
  const pathname = usePathname();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  const navLinks = mainNavLinks.filter((link) => link.type === "link");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryRef]);

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40 h-12">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          <div className="hidden md:flex flex-1 items-center gap-2">
            {navLinks.map((link) => {
              // --- RENDER THE CATEGORY DROPDOWN BUTTON ---
              if (link.subMenu) {
                return (
                  <div
                    key={link.name.en}
                    className="relative"
                    ref={categoryRef}
                  >
                    <Button
                      onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                      variant={isCategoryMenuOpen ? "secondary" : "outline"}
                      size="sm"
                      className="h-8"
                    >
                      <link.icon className="h-4 w-4 mr-2" />
                      <span>{link.name[language]}</span>
                      <ChevronDown
                        className={`h-4 w-4 ml-2 transition-transform ${
                          isCategoryMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    {isCategoryMenuOpen && (
                      // 1. WIDENED THE DROPDOWN CONTAINER FOR TWO COLUMNS
                      <div className="absolute top-full left-0 mt-2 w-96 rounded-md shadow-lg bg-background border z-50 animate-in fade-in-0 zoom-in-95">
                        {/* 2. APPLIED CSS GRID FOR THE TWO-COLUMN LAYOUT */}
                        <div className="p-2 grid grid-cols-2 gap-x-2 gap-y-1">
                          {link.subMenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsCategoryMenuOpen(false)}
                              // 3. ADDED CONDITIONAL STYLING FOR THE "SEE ALL" LINK
                              className={`
                                flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors
                                ${
                                  subItem.href === '/categories'
                                    ? 'col-span-2 mt-1 border-t'
                                    : ''
                                }
                              `}
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.name[language]}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // --- RENDER ALL OTHER STANDARD LINKS ---
              const isActive = link.href
                ? pathname.startsWith(link.href)
                : false;
              return (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive ? "secondary" : "outline"}
                  size="sm"
                  className="h-8"
                >
                  <Link href={link.href!}>
                    <link.icon className="h-4 w-4 mr-2" />
                    <span>{link.name[language]}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          <div className="flex-shrink-0 ml-auto">
            <ZoneSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}