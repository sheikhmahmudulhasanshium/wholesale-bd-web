// app/dashboard/body.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/contexts/auth-context';
import { useLanguage } from '@/app/components/contexts/language-context';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import Footer from '@/app/components/common/footer';
import { Header } from '@/app/components/common/header';
import { ZoneSelector } from '@/app/components/common/buttons/zone-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, DollarSign, LayoutDashboard, MenuIcon, Package, PlusCircle, ShoppingCart, Users, Settings, History, BarChart2 } from 'lucide-react';
import { useDashboardStats } from '@/app/components/hooks/use-dashboard-stats';
import { Badge } from '@/components/ui/badge';

// --- DASHBOARD NAVIGATION (Simplified for this view) ---
const dashboardNavLinks = [
  { name: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, href: '/dashboard', icon: LayoutDashboard },
  { name: { en: 'Products', bn: 'পণ্য' }, href: '/products', icon: Package },
  { name: { en: 'Orders', bn: 'অর্ডার' }, href: '/dashboard/orders', icon: ShoppingCart },
  { name: { en: 'Settings', bn: 'সেটিংস' }, href: '/dashboard/settings', icon: Settings },
];

function DashboardNavMenu() {
    // ... (This component can remain as it is, no changes needed)
    const { language } = useLanguage();
    const pathname = usePathname();
    return (
      <nav className="border-b bg-background/95 backdrop-blur-sm h-12">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            <div className="flex items-center gap-2">
              {dashboardNavLinks.map((link) => (
                <Button key={link.href} asChild variant={pathname === link.href ? "secondary" : "ghost"} size="sm" className="h-8">
                  <Link href={link.href!}>
                    <link.icon className="h-4 w-4 mr-2" />
                    <span>{link.name[language]}</span>
                  </Link>
                </Button>
              ))}
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
    // ... (This component can also remain as it is)
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
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
            {dashboardNavLinks.map((link) => (
              <Link key={link.href} href={link.href!} onClick={() => setIsOpen(false)} className="flex items-center w-full p-3 text-base font-medium rounded-md text-foreground/80 hover:bg-accent hover:text-accent-foreground">
                <link.icon className="h-5 w-5 mr-3" />
                <span>{link.name[language]}</span>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
}

// =================================================================================
// MAIN CLIENT PAGE COMPONENT (Completely Refactored)
// =================================================================================

export default function DashboardClientPage() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { stats, isLoading: isLoadingStats } = useDashboardStats();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);
  
  const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: React.ElementType, description?: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (isAuthLoading || isLoadingStats) {
      return (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[108px] w-full" />
            <Skeleton className="h-[108px] w-full" />
            <Skeleton className="h-[108px] w-full" />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      );
    }
    
    if (!user) return null; // Should be redirected, but as a fallback

    return (
      <div className="space-y-8">
        {/* === Top Row Stat Cards (Role-Based) === */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {user.role === 'admin' && (
            <>
              <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} description="Across all sellers" />
              <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} description="Customers & Sellers" />
              <StatCard title="Pending Orders" value={12} icon={ShoppingCart} description="Awaiting fulfillment" />
            </>
          )}
          {user.role === 'seller' && (
            <>
              <StatCard title="My Products" value={stats?.myProductsCount ?? 0} icon={Package} description="Active listings" />
              <StatCard title="Total Sales" value="৳12,842.50" icon={DollarSign} description="+20.1% from last month" />
              <StatCard title="New Orders" value={52} icon={ShoppingCart} description="Pending fulfillment" />
            </>
          )}
        </div>

        {/* === Second Row Infographics (Role-Based) === */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5"/> Recent Search History</CardTitle>
              <CardDescription>Your last 10 search queries.</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.userActivity?.recentSearches && stats.userActivity.recentSearches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stats.userActivity.recentSearches.map((term, i) => (
                    <Link key={i} href={`/search?q=${encodeURIComponent(term)}`}>
                      <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">{term}</Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No recent search history found.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5"/> Most Visited Pages</CardTitle>
              <CardDescription>This is a placeholder for analytics data.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between"><span>/products/apple-iphone-13</span> <span>128 views</span></li>
                <li className="flex justify-between"><span>/products/denim-jeans</span> <span>97 views</span></li>
                <li className="flex justify-between"><span>/</span> <span>85 views</span></li>
                <li className="flex justify-between"><span>/categories/electronics</span> <span>62 views</span></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={<DashboardNavMenu />} sidebar={<DashboardSidebar />}>
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {user?.role === 'admin' ? "Admin Dashboard" : user?.role === 'seller' ? "Seller Dashboard" : "My Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {user?.role === 'admin' ? "An overview of the platform's performance." : "An overview of your store's performance."}
            </p>
          </div>
          {user?.role === 'seller' && (
            <Button asChild>
              <Link href="/products/add-product">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
          )}
        </div>
        {renderContent()}
      </div>
    </BasicPageProvider>
  );
}