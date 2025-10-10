// FILE: app/components/common/sidebar.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/components/contexts/language-context";
import { mainNavLinks } from "@/lib/menu";
import { ZoneSelector } from "./buttons/zone-selector";
import { useState } from "react";
import Image from "next/image";

// Reusable component for sidebar links to handle closing the sheet on navigation
const MobileNavLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => (
  <Link href={href} onClick={onClick}>
    <Button variant="ghost" className="w-full justify-start text-base gap-4 px-4 py-6">
      {children}
    </Button>
  </Link>
);

const Sidebar = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = mainNavLinks.filter((link) => link.type === "link");
  const categoryLink = mainNavLinks.find((link) => link.subMenu);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  src="/logo/logo.svg"
                  alt="Wholesale BD Logo"
                  width={170}
                  height={40}
                  priority
                />
              </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col p-4 space-y-2">
          {/* Main Navigation Links */}
          {navLinks.map((link) => {
              // Handle regular links
            if (!link.subMenu) {
              return (
                <MobileNavLink key={link.href} href={link.href!} onClick={() => setIsOpen(false)}>
                  <link.icon className="h-5 w-5" />
                  <span>{link.name[language]}</span>
                </MobileNavLink>
              );
            }
            return null; // Skip category parent, we render sub-items below
          })}

          {/* Category Sub-menu items */}
          {categoryLink?.subMenu && (
            <>
              <div className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground uppercase">
                {categoryLink.name[language]}
              </div>
              {categoryLink.subMenu.map((subItem) => (
                <MobileNavLink key={subItem.href} href={subItem.href} onClick={() => setIsOpen(false)}>
                  <subItem.icon className="h-5 w-5" />
                  <span>{subItem.name[language]}</span>
                </MobileNavLink>
              ))}
            </>
          )}

          {/* Extensibility: Add other components here */}
          <div className="border-t pt-4 mt-4 space-y-4">
              <div className="px-4 text-sm font-semibold text-muted-foreground uppercase">Settings</div>
              <div className="px-4">
                <ZoneSelector />
              </div>
              {/* You can add more components here in the future */}
              {/* <AnotherComponent /> */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;