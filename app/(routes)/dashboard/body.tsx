// app/dashboard/body.tsx
"use client";

import React, { useState, useEffect } from 'react';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutDashboard, MenuIcon, Package, PlusCircle, ShoppingCart, Settings } from 'lucide-react';
import { useDashboardStats } from '@/app/components/hooks/use-dashboard-stats';
import { AdminDashboardView } from './views/admin-view';
import { SellerDashboardView } from './views/seller-view';
import { CustomerDashboardView } from './views/customer-view';

// --- DASHBOARD NAVIGATION (Remains the same) ---
const dashboardNavLinks = [
  { name: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, href: '/dashboard', icon: LayoutDashboard },
  { name: { en: 'Products', bn: 'পণ্য' }, href: '/products', icon: Package },
  { name: { en: 'Orders', bn: 'অর্ডার' }, href: '/orders', icon: ShoppingCart },
  { name: { en: 'Settings', bn: 'সেটিংস' }, href: '/dashboard/settings', icon: Settings },
];

function DashboardNavMenu() {
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
// MAIN CLIENT PAGE COMPONENT (Refactored)
// =================================================================================

export default function DashboardClientPage() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { stats, isLoading: isLoadingStats } = useDashboardStats();
  
  // Redirect if not logged in. This logic stays in the parent component.
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);
  
  // This function now delegates rendering to the appropriate view component.
  const renderDashboardView = () => {
    // Show a general loading skeleton while authentication is in progress
    if (isAuthLoading) {
      return (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[108px] w-full" />
            <Skeleton className="h-[108px] w-full" />
            <Skeleton className="h-[108px] w-full" />
          </div>
        </div>
      );
    }
    
    // Fallback if user is null after loading (should be redirected)
    if (!user) return null;

    // Render the correct dashboard based on user role
    switch (user.role) {
      case 'admin':
        return <AdminDashboardView stats={stats} isLoading={isLoadingStats} />;
      case 'seller':
        return <SellerDashboardView stats={stats} isLoading={isLoadingStats} />;
      case 'customer':
      default:
        return <CustomerDashboardView stats={stats} isLoading={isLoadingStats} />;
    }
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={<DashboardNavMenu />} sidebar={<DashboardSidebar />}>
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {isAuthLoading ? (
                <Skeleton className="h-9 w-64" />
              ) : (
                <>
                  {user?.role === 'admin' ? "Admin Dashboard" : user?.role === 'seller' ? "Seller Dashboard" : "My Dashboard"}
                </>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isAuthLoading ? (
                 <Skeleton className="h-5 w-80 mt-1" />
              ) : (
                <>
                  {user?.role === 'admin' ? "An overview of the platform's performance." : user?.role === 'seller' ? "An overview of your store's performance." : "Manage your account and view recent activity."}
                </>
              )}
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
        {renderDashboardView()}
      </div>
    </BasicPageProvider>
  );
}