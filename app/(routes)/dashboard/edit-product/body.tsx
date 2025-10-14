"use client";

import React, { Suspense, useState, useRef, useEffect, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

// Hooks & Providers
import { useProduct } from '@/app/components/hooks/get-product';
import { useLanguage } from '@/app/components/contexts/language-context';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';

// Common Components
import { Header } from '@/app/components/common/header';
import Footer from '@/app/components/common/footer';
import { ZoneSelector } from '@/app/components/common/buttons/zone-selector';
import { EditProductForm } from '@/app/components/forms/edit-product-form';

// UI Components
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

// Icons
import { 
  FilePenLine, AlertTriangle, SearchX, ChevronDown, LayoutDashboard, MenuIcon, ChevronRight,
  Package, PlusCircle, ShoppingCart, Users, Settings, Search, Trash2 
} from 'lucide-react';


// =================================================================================
// LOCAL DASHBOARD NAVIGATION (This remains the same)
// =================================================================================
const dashboardNavLinks = [
  { name: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, href: '/dashboard', icon: LayoutDashboard },
  { name: { en: 'Manage Products', bn: 'পণ্য পরিচালনা' }, icon: Package, subMenu: [
      { name: { en: 'Add New Product', bn: 'নতুন পণ্য যোগ করুন' }, href: '/dashboard/add-product', icon: PlusCircle },
      { name: { en: 'Edit Product', bn: 'পণ্য এডিট করুন' }, href: '/dashboard/edit-product', icon: FilePenLine },
      { name: { en: 'Search Products', bn: 'পণ্য সার্চ করুন' }, href: '/dashboard/search-product', icon: Search },
      { name: { en: 'Delete Product', bn: 'পণ্য মুছুন' }, href: '/dashboard/delete-product', icon: Trash2 },
    ]
  },
  { name: { en: 'Orders', bn: 'অর্ডার' }, href: '/dashboard/orders', icon: ShoppingCart },
  { name: { en: 'Customers', bn: 'গ্রাহক' }, href: '/dashboard/customers', icon: Users },
  { name: { en: 'Settings', bn: 'সেটিংস' }, href: '/dashboard/settings', icon: Settings },
];

function DashboardNavMenu() {
    const { language } = useLanguage();
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setOpenDropdown(null);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
      <nav className="border-b bg-background/95 backdrop-blur-sm h-12">
        <div className="container mx-auto px-4 h-full"><div className="flex items-center justify-between h-full gap-4"><div className="flex items-center gap-2">
            {dashboardNavLinks.map((link) => {
              if (link.subMenu) {
                const isDropdownOpen = openDropdown === link.name.en;
                return ( <div key={link.name.en} className="relative" ref={isDropdownOpen ? dropdownRef : null}><Button onClick={() => setOpenDropdown(isDropdownOpen ? null : link.name.en)} variant={isDropdownOpen ? "secondary" : "ghost"} size="sm" className="h-8"><link.icon className="h-4 w-4 mr-2" /><span>{link.name[language]}</span><ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} /></Button>{isDropdownOpen && ( <div className="absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg bg-background border z-50 animate-in fade-in-0 zoom-in-95"><div className="p-2 grid grid-cols-1 gap-1">{link.subMenu.map((subItem) => ( <Link key={subItem.href} href={subItem.href} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"><subItem.icon className="h-4 w-4" /><span>{subItem.name[language]}</span></Link>))}</div></div>)}</div>);
              }
              const isActive = link.href ? pathname === link.href : false;
              return ( <Button key={link.href} asChild variant={isActive ? "secondary" : "ghost"} size="sm" className="h-8"><Link href={link.href!}><link.icon className="h-4 w-4 mr-2" /><span>{link.name[language]}</span></Link></Button>);
            })}
        </div><div className="flex items-center gap-2 ml-auto"><ZoneSelector /></div></div></div>
      </nav>
    );
}
function DashboardSidebar() {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (<Link href={href} onClick={() => setIsOpen(false)} className="flex items-center w-full p-3 text-base font-medium rounded-md text-foreground/80 hover:bg-accent hover:text-accent-foreground">{children}</Link>);
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}><SheetTrigger asChild><Button variant="outline" size="icon"><MenuIcon className="h-6 w-6" /><span className="sr-only">Open Menu</span></Button></SheetTrigger>
        <SheetContent side="left" className="w-full max-w-sm p-0 flex flex-col"><SheetHeader className="p-4 border-b"><SheetTitle><Link href="/" onClick={() => setIsOpen(false)}><Image src="/logo/logo.svg" alt="Wholesale BD Logo" width={170} height={40} priority /></Link></SheetTitle></SheetHeader>
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {dashboardNavLinks.map((link) => {
              if (link.subMenu) {
                const isSubMenuOpen = openSubMenu === link.name.en;
                return (<div key={link.name.en}><button onClick={() => setOpenSubMenu(isSubMenuOpen ? null : link.name.en)} className="flex items-center justify-between w-full p-3 text-base font-medium rounded-md hover:bg-accent"><div className="flex items-center"><link.icon className="h-5 w-5 mr-3" /><span>{link.name[language]}</span></div><ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isSubMenuOpen ? "rotate-180" : ""}`} /></button>{isSubMenuOpen && (<div className="pl-8 pt-1 space-y-1 animate-in fade-in-0">{link.subMenu.map((subItem) => (<MobileNavLink key={subItem.href} href={subItem.href}><subItem.icon className="h-5 w-5 mr-3 text-muted-foreground" /><span>{subItem.name[language]}</span></MobileNavLink>))}</div>)}</div>);
              } else if (link.href) {
                return (<MobileNavLink key={link.name.en} href={link.href}><link.icon className="h-5 w-5 mr-3" /><span>{link.name[language]}</span></MobileNavLink>);
              } return null;
            })}
          </div><div className="p-4 mt-auto border-t space-y-4"><h3 className="px-3 text-sm font-semibold text-muted-foreground uppercase">Settings</h3><div className="px-3"><ZoneSelector /></div></div>
        </SheetContent>
      </Sheet>
    );
}

// =================================================================================
// THE WORKAROUND: A custom, correctly translated breadcrumb for this page only
// =================================================================================
function CorrectedBreadcrumb() {
  const { language } = useLanguage();
  const breadcrumbText = {
    home: { en: 'Home', bn: 'হোম' },
    dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
    editProduct: { en: 'Edit Product', bn: 'পণ্য এডিট' },
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/">{breadcrumbText.home[language]}</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/dashboard">{breadcrumbText.dashboard[language]}</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumbText.editProduct[language]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

// =================================================================================
// Main Page Content Component
// =================================================================================

function EditProductPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const { language } = useLanguage();

  const { data: product, isLoading, error } = useProduct(productId);
  const pageText = { pageTitle: { en: 'Edit Product', bn: 'পণ্য এডিট করুন' }, loading: { en: 'Loading Product...', bn: 'পণ্য লোড হচ্ছে...' }, errorTitle: { en: 'Error Loading Product', bn: 'পণ্য লোড করতে ত্রুটি' }, errorDescription: { en: 'There was an issue fetching the product data. Please check your connection and try again.', bn: 'পণ্যের ডেটা আনতে একটি সমস্যা হয়েছে। অনুগ্রহ করে আপনার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।' }, notFoundTitle: { en: 'Product Not Found', bn: 'পণ্যটি খুঁজে পাওয়া যায়নি' }, notFoundDescription: { en: 'We couldn’t find a product with the specified ID. It may have been moved or deleted. Please use the search bar in the header to find another product.', bn: 'নির্দিষ্ট আইডি সহ একটি পণ্য খুঁজে পাওয়া যায়নি। এটি সরানো বা মুছে ফেলা হতে পারে। অন্য পণ্য খুঁজতে অনুগ্রহ করে হেডারে সার্চ বার ব্যবহার করুন।' }, goToDashboard: { en: 'Go to Dashboard', bn: 'ড্যাশবোর্ডে যান' }, editingTitle: { en: 'Editing:', bn: 'এডিট করছেন:' } };
  
  const renderContent = () => { /* ... your full renderContent function ... */ };
  
  return (
    <div data-hide-breadcrumb> {/* This attribute will be used by CSS to hide the default breadcrumb */}
      {/* We are NOT using BasicPageProvider here to have full control */}
      <style jsx global>{`
        [data-hide-breadcrumb] [data-id="default-breadcrumb-nav"] {
          display: none;
        }
      `}</style>

      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="sticky top-0 z-40 bg-background">
          <div className="md:hidden border-b flex items-center p-2 h-12">
            <DashboardSidebar />
          </div>
          <div className="hidden md:block">
            <DashboardNavMenu />
          </div>
        </div>
        
        {/* Render our own CORRECT breadcrumb */}
        <CorrectedBreadcrumb />

        <main className="flex-grow">
          <div className="container mx-auto p-4 md:p-8">
            {!product && !isLoading && (
              <h1 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3">
                <FilePenLine />
                {pageText.pageTitle[language]}
              </h1>
            )}
            {/* ... (Your existing renderContent logic) ... */}
            {isLoading && <div className="space-y-6"><Skeleton className="h-10 w-3/4" /><div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-32 w-full" /></div></div>}
            {error && <Card className="border-destructive"><CardHeader><CardTitle className="flex items-center gap-3 text-destructive"><AlertTriangle />{pageText.errorTitle[language]}</CardTitle><CardDescription>{pageText.errorDescription[language]}</CardDescription></CardHeader></Card>}
            {(!productId || !product) && !isLoading && !error && <Card><CardHeader><CardTitle className="flex items-center gap-3"><SearchX className="text-muted-foreground" />{pageText.notFoundTitle[language]}</CardTitle><CardDescription>{pageText.notFoundDescription[language]}</CardDescription></CardHeader><CardContent><Button asChild><Link href="/dashboard">{pageText.goToDashboard[language]}</Link></Button></CardContent></Card>}
            {product && !isLoading && !error && <div><h2 className="text-2xl font-bold tracking-tight mb-6">{pageText.editingTitle[language]} <span className="font-normal text-muted-foreground">{product.name}</span></h2><EditProductForm initialData={product} /></div>}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

// We need to slightly modify BasicPageProvider to add the data-id for our CSS selector
// Since we cannot edit the file, we will re-create a similar provider structure manually
// in this file, which is what the code above does. 
// If BasicPageProvider looked like this, the CSS would work:
//
// export function BasicPageProvider(...) {
//   return (
//     ...
//     <div data-id="default-breadcrumb-nav"><BreadcrumbNav /></div>
//     ...
//   )
// }
//
// Since we can't do that, we have stopped using BasicPageProvider on this page
// and replicated its structure directly inside EditProductPageContent.

export default function EditProductClientPage() {
    return (
        <Suspense fallback={<div>Loading Page...</div>}>
            <EditProductPageContent />
        </Suspense>
    );
}