"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/app/components/contexts/language-context";
import {
  ChevronDown, LucideProps, Tag, Shapes, Sparkles, MenuIcon,
  // Import icons for dynamic rendering
  Smartphone, ShoppingBag, Coffee, Home, Heart, Gamepad2, Book, Car, PawPrint,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button"; // <-- 1. IMPORT buttonVariants
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ZoneSelector } from "./buttons/zone-selector";
import { useCategories } from "../hooks/use-categories";
import { slugify } from "@/lib/utils";

// --- Dynamic Icon Helper ---
const iconComponents: { [key: string]: React.ElementType<LucideProps> } = {
  smartphone: Smartphone, "shopping-bag": ShoppingBag, coffee: Coffee,
  home: Home, heart: Heart, gamepad: Gamepad2, book: Book, car: Car, paw: PawPrint,
};
interface DynamicIconProps extends LucideProps { name?: string; }
const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = name ? iconComponents[name] : null;
  if (!IconComponent) return <Tag {...props} />;
  return <IconComponent {...props} />;
};

// --- Component for the Category Dropdown using DropdownMenu ---
const CategoryDropdown = () => {
  const { language } = useLanguage();
  const pathname = usePathname();
  const { categories, isLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = pathname.startsWith('/products');

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isOpen || isActive ? "secondary" : "outline"}
          size="sm"
          className="h-8"
          disabled={isLoading}
        >
          <Shapes className="h-4 w-4 mr-2" />
          <span>{language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</span>
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      {/* --- 2. RE-INTRODUCED FIXED WIDTH FOR GRID LAYOUT --- */}
      <DropdownMenuContent align="start" className="w-96">
        <div className="p-2 grid grid-cols-2 gap-x-2 gap-y-1">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))
          ) : (
            // --- 3. REPLACED Button asChild WITH STYLED Link ---
            categories?.map((cat) => (
              <Link
                key={cat._id}
                href={`/products#${slugify("category", cat.name)}`}
                onClick={() => setIsOpen(false)}
                className={buttonVariants({ variant: "ghost", className: "w-full justify-start gap-3" })}
              >
                <DynamicIcon name={cat.icon} className="h-4 w-4" />
                <span>{language === "bn" ? cat.name_bn : cat.name}</span>
              </Link>
            ))
          )}
          <DropdownMenuSeparator className="col-span-2 my-1" />
          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className={buttonVariants({ variant: "ghost", className: "col-span-2 w-full justify-start gap-3" })}
          >
            <Shapes className="h-4 w-4" />
            <span>{language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}</span>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- Main NavMenu Component ---
export function NavMenu() {
  const [isNavSheetOpen, setIsNavSheetOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40 h-14 flex items-center w-full justify-between">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between h-full gap-4">
          
          <div className="flex-shrink-0">
            <Sheet open={isNavSheetOpen} onOpenChange={setIsNavSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open Navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>
                    <Link href="/" onClick={() => setIsNavSheetOpen(false)}>
                      <Image src="/logo/logo.svg" alt="Logo" width={150} height={35} />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-2 space-y-1">
                  <Button asChild variant="ghost" className="w-full justify-start"><Link href="/" onClick={() => setIsNavSheetOpen(false)}>Home</Link></Button>
                  <Button asChild variant="ghost" className="w-full justify-start"><Link href="/products" onClick={() => setIsNavSheetOpen(false)}>Products</Link></Button>
                  <Button asChild variant="ghost" className="w-full justify-start"><Link href="/orders" onClick={() => setIsNavSheetOpen(false)}>Orders</Link></Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <CategoryDropdown />
            
            <Button asChild variant="outline" size="sm" className="h-8">
              <Link href="/products#collection">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>{language === 'bn' ? 'কালেকশন' : 'Collections'}</span>
              </Link>
            </Button>
            
            <ZoneSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}