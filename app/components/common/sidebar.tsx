"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Menu, ListIcon, Radar, Globe, BoxesIcon, Sparkles, ChevronDown,
  // Import icons for dynamic rendering
  Smartphone, ShoppingBag, Coffee, Home, Heart, Gamepad2, Book, Car, PawPrint, Tag,
  LucideProps 
} from "lucide-react";

import { useLanguage } from '@/app/components/contexts/language-context';
import { useCategories } from '@/app/components/hooks/use-categories';
import { useCollections } from '@/app/components/hooks/use-collections';
import { useZones } from '../hooks/get-zones';
import { slugify } from '@/lib/utils';
import { cn } from '@/lib/utils'; // Assuming you have cn for class merging

// --- Helper Component for Dynamic Icons ---
const iconComponents: { [key: string]: React.ElementType<LucideProps> } = {
  smartphone: Smartphone,
  'shopping-bag': ShoppingBag,
  coffee: Coffee,
  home: Home,
  heart: Heart,
  gamepad: Gamepad2,
  book: Book,
  car: Car,
  paw: PawPrint,
};

interface DynamicIconProps extends LucideProps {
  name?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = name ? iconComponents[name] : null;
  if (!IconComponent) {
    return <Tag {...props} />; // Default icon
  }
  return <IconComponent {...props} />;
};
// --- End Helper Component ---


interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onLinkClick?: () => void;
}

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, onLinkClick }: SidebarProps) => {
  const { language } = useLanguage();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { zones, loading: isLoadingZones } = useZones();
  const { collections, isLoading: isLoadingCollections } = useCollections();

  // State for managing the collapsible categories section
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(true);

  const isLoading = isLoadingCategories || isLoadingZones || isLoadingCollections;

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
    setIsSidebarOpen(false);
  };

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Page Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>
            <Image src={'/logo/logo.svg'} alt="Menu" height={100} width={200}/>
          </SheetTitle>
        </SheetHeader>
        <SheetDescription className="pl-4 pt-2">Select Menu</SheetDescription>
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
          
          {/* Manually Implemented Collapsible Categories Section */}
          <div className="space-y-1">
            {/* This button acts as the trigger */}
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="w-full flex justify-between items-center rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-2">
                <ListIcon className="h-6 w-6"/> 
                <h3 className="text-base normal-case">Categories</h3>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform duration-200",
                isCategoriesOpen && "rotate-180" // Rotate icon when open
              )} />
            </button>
            
            {/* This content is conditionally rendered */}
            {isCategoriesOpen && (
              <div className="pl-2 space-y-1">
                {isLoading ? <Skeleton className="h-48 w-full" /> : categories?.map((cat) => (
                  <Link key={cat._id} href={`/products#${slugify('category', cat.name)}`} onClick={handleLinkClick} className="block">
                    <Button variant="ghost" className="w-full justify-start text-base gap-3 h-12">
                      <DynamicIcon name={cat.icon} className="h-5 w-5 text-muted-foreground"/>
                      {language === 'bn' ? cat.name_bn : cat.name}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Zones Section */}
          <div>
            <div className="px-3 pt-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-t flex items-center gap-2">
              <Radar className="h-6 w-6"/><h3 className="text-base">Zones</h3>
            </div>
            {isLoading ? <Skeleton className="h-24 w-full" /> : zones?.map((zone) => (
              <Link key={zone._id} href={`/products#${slugify('zone', zone.name)}`} onClick={handleLinkClick} className="block">
                <Button variant="ghost" className="w-full justify-start text-base gap-3 h-12">
                  <Globe className="h-5 w-5 text-muted-foreground"/>{zone.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Collections Section */}
          <div>
            <div className="px-3 pt-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-t flex items-center gap-2">
              <BoxesIcon className="h-6 w-6"/><h3 className="text-base">Collections</h3>
            </div>
            {isLoading ? <Skeleton className="h-24 w-full" /> : collections?.map((collection) => (
              <Link key={collection._id} href={`/products#${slugify('collection', collection.url)}`} onClick={handleLinkClick} className="block">
                <Button variant="ghost" className="w-full justify-start text-base gap-3 h-12">
                  <Sparkles className="h-5 w-5 text-muted-foreground"/>
                  {language === 'bn' ? collection.title_bn : collection.title}
                </Button>
              </Link>
            ))}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;