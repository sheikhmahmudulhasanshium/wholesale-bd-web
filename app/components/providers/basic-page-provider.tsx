// FILE: app/components/providers/basic-page-provider.tsx
// app/components/layout/BasicPageProvider.tsx
import React from 'react';
import { BreadcrumbNav } from '../common/breadcrumb-nav';

interface BasicPageProviderProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
  navbar?: React.ReactNode;
  sidebar?: React.ReactNode;
}

// This is a Server Component, so no "use client"
export function BasicPageProvider({ header, footer,navbar, children,sidebar }: BasicPageProviderProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {header}
      
      {/* Secondary Navigation Area - Switches between mobile and desktop */}
      <div className="sticky top-0 z-40 bg-background">
        {/* Mobile Sidebar Trigger (only shows on mobile) */}
        <div className="md:hidden border-b flex items-center p-2 h-12">
          {sidebar}
          {/* You can add other mobile-only action buttons here in the future */}
        </div>

        {/* Desktop Navbar (only shows on desktop) */}
        <div className="hidden md:block">
          {navbar}
        </div>
      </div>
      
      <BreadcrumbNav />

      <main className="flex-grow">
        {children}
      </main>
      {footer}
    </div>
  );
}