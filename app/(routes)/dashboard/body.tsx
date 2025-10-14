"use client";

// --- IMPORTS ---
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Providers & Contexts
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import { useLanguage } from '@/app/components/contexts/language-context';

// Common Components
import Footer from '@/app/components/common/footer';
import { Header } from '@/app/components/common/header';
import { ZoneSelector } from '@/app/components/common/buttons/zone-selector';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Icons
import { 
  ChevronDown, DollarSign, LayoutDashboard, MenuIcon, Package, 
  PlusCircle, ShoppingCart, Users, Settings, FilePenLine, Search, Trash2
} from 'lucide-react';

// =================================================================================
// CUSTOM DASHBOARD NAVIGATION DATA
// =================================================================================
const dashboardNavLinks = [
  { name: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, href: '/dashboard', icon: LayoutDashboard },
  { name: { en: 'Manage Products', bn: 'পণ্য পরিচালনা' }, icon: Package, subMenu: [
      { name: { en: 'Add New Product', bn: 'নতুন পণ্য যোগ করুন' }, href: '/dashboard/add-product', icon: PlusCircle },
      { name: { en: 'Edit Product', bn: 'পণ্য সম্পাদনা করুন' }, href: '/dashboard/edit-product', icon: FilePenLine },
      { name: { en: 'Search Products', bn: 'পণ্য খুঁজুন' }, href: '/dashboard/search-product', icon: Search },
      { name: { en: 'Delete Product', bn: 'পণ্য মুছুন' }, href: '/dashboard/delete-product', icon: Trash2 },
    ]
  },
  { name: { en: 'Orders', bn: 'অর্ডার' }, href: '/dashboard/orders', icon: ShoppingCart },
  { name: { en: 'Customers', bn: 'গ্রাহক' }, href: '/dashboard/customers', icon: Users },
  { name: { en: 'Settings', bn: 'সেটিংস' }, href: '/dashboard/settings', icon: Settings },
];

// (The DashboardNavMenu and DashboardSidebar components remain unchanged and are omitted for brevity)
// ... paste your existing DashboardNavMenu and DashboardSidebar components here ...

function DashboardNavMenu() {
    const { language } = useLanguage();
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navLinks = dashboardNavLinks;
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    return (
      <nav className="border-b bg-background/95 backdrop-blur-sm h-12">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            <div className="flex items-center gap-2">
              {navLinks.map((link) => {
                const isDropdownOpen = openDropdown === link.name.en;
                if (link.subMenu) {
                  return (
                    <div key={link.name.en} className="relative" ref={isDropdownOpen ? dropdownRef : null}>
                      <Button onClick={() => setOpenDropdown(isDropdownOpen ? null : link.name.en)} variant={isDropdownOpen ? "secondary" : "ghost"} size="sm" className="h-8">
                        <link.icon className="h-4 w-4 mr-2" />
                        <span>{link.name[language]}</span>
                        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                      </Button>
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg bg-background border z-50 animate-in fade-in-0 zoom-in-95">
                          <div className="p-2 grid grid-cols-1 gap-1">
                            {link.subMenu.map((subItem) => (
                              <Link key={subItem.href} href={subItem.href} onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
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
                const isActive = link.href ? pathname === link.href : false;
                return (
                  <Button key={link.href} asChild variant={isActive ? "secondary" : "ghost"} size="sm" className="h-8">
                    <Link href={link.href!}>
                      <link.icon className="h-4 w-4 mr-2" />
                      <span>{link.name[language]}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <ZoneSelector />
            </div>
          </div>
        </div>
      </nav>
    );
}

function DashboardSidebar() {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  
    const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
      <Link href={href} onClick={() => setIsOpen(false)} className="flex items-center w-full p-3 text-base font-medium rounded-md text-foreground/80 hover:bg-accent hover:text-accent-foreground">
        {children}
      </Link>
    );
  
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-sm p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image src="/logo/logo.svg" alt="Wholesale BD Logo" width={170} height={40} priority />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {dashboardNavLinks.map((link) => {
              const isSubMenuOpen = openSubMenu === link.name.en;
              if (link.subMenu) {
                return (
                  <div key={link.name.en}>
                    <button onClick={() => setOpenSubMenu(isSubMenuOpen ? null : link.name.en)} className="flex items-center justify-between w-full p-3 text-base font-medium rounded-md hover:bg-accent">
                      <div className="flex items-center">
                        <link.icon className="h-5 w-5 mr-3" />
                        <span>{link.name[language]}</span>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isSubMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isSubMenuOpen && (
                      <div className="pl-8 pt-1 space-y-1 animate-in fade-in-0">
                        {link.subMenu.map((subItem) => (
                          <MobileNavLink key={subItem.href} href={subItem.href}>
                            <subItem.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                            <span>{subItem.name[language]}</span>
                          </MobileNavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              else if (link.href) {
                return (
                  <MobileNavLink key={link.name.en} href={link.href}>
                    <link.icon className="h-5 w-5 mr-3" />
                    <span>{link.name[language]}</span>
                  </MobileNavLink>
                );
              }
              return null;
            })}
          </div>
          <div className="p-4 mt-auto border-t space-y-4">
            <h3 className="px-3 text-sm font-semibold text-muted-foreground uppercase">Settings</h3>
            <div className="px-3">
              <ZoneSelector />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
}
// =================================================================================
// MAIN CLIENT PAGE COMPONENT WITH TRANSLATIONS
// =================================================================================

export default function DashboardClientPage() {
  const { language } = useLanguage();

  // 1. Translation object for all page content
  const pageText = {
    dashboardTitle: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
    dashboardSubtitle: { en: "An overview of your store's performance.", bn: 'আপনার দোকানের পারফরম্যান্সের একটি সংক্ষিপ্ত বিবরণ।' },
    addNewProduct: { en: 'Add New Product', bn: 'নতুন পণ্য যোগ করুন' },
    totalRevenue: { en: 'Total Revenue', bn: 'মোট রাজস্ব' },
    revenueTrend: { en: '+20.1% from last month', bn: 'গত মাস থেকে +২০.১%' },
    newOrders: { en: 'New Orders', bn: 'নতুন অর্ডার' },
    ordersTrend: { en: '+12.5% from last month', bn: 'গত মাস থেকে +১২.৫%' },
    productsInStock: { en: 'Products in Stock', bn: 'স্টকে থাকা পণ্য' },
    stockWarning: { en: '2 items are low on stock', bn: '২টি আইটেম স্টকে কম আছে' },
    recentProducts: { en: 'Recent Products', bn: 'সাম্প্রতিক পণ্য' },
  };

  // 2. Mock data updated with bilingual status
  const recentProducts = [
    { id: 'PROD-001', name: 'Premium Cotton T-Shirt', status: { en: 'In Stock', bn: 'স্টকে আছে' }, price: '$25.00' },
    { id: 'PROD-002', name: 'Leather Wallet', status: { en: 'In Stock', bn: 'স্টকে আছে' }, price: '$45.00' },
    { id: 'PROD-003', name: 'Smart Watch Series X', status: { en: 'Low Stock', bn: 'স্টক কম' }, price: '$199.00' },
  ];

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={<DashboardNavMenu />} sidebar={<DashboardSidebar />}>
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              {pageText.dashboardTitle[language]}
            </h1>
            <p className="text-muted-foreground mt-1">
              {pageText.dashboardSubtitle[language]}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/add-product">
              <PlusCircle className="mr-2 h-4 w-4" />
              {pageText.addNewProduct[language]}
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{pageText.totalRevenue[language]}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">{pageText.revenueTrend[language]}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{pageText.newOrders[language]}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+1,234</div>
              <p className="text-xs text-muted-foreground">{pageText.ordersTrend[language]}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{pageText.productsInStock[language]}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">{pageText.stockWarning[language]}</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{pageText.recentProducts[language]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className='truncate'>{product.name}</CardTitle>
                  <CardDescription>{product.id}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  {/* 3. Badge variant uses English for logic, but displays the translated text */}
                  <Badge variant={
                    product.status.en === 'In Stock' ? 'default' :
                    product.status.en === 'Low Stock' ? 'secondary' : 'destructive'
                  }>
                    {product.status[language]}
                  </Badge>
                  <span className="text-lg font-semibold">{product.price}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </BasicPageProvider>
  );
}