// FILE: app/components/common/breadcrumb-nav.tsx
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';

// Translations for breadcrumb segments
const breadcrumbTranslations = {
  en: {
    home: 'Home',
    about: 'About',
    dashboard: 'Dashboard',
    products: 'Products',
    category: 'Category',
  },
  bn: {
    home: 'হোম',
    about: 'আমাদের সম্পর্কে',
    dashboard: 'ড্যাশবোর্ড',
    products: 'পণ্য',
    category: 'ক্যাটাগরি',
  }
};

// A utility function to format the URL segment using the correct language
const formatSegment = (segment: string, t: typeof breadcrumbTranslations.en): string => {
  const decodedSegment = decodeURIComponent(segment).toLowerCase();
  
  // Check for a direct translation first
  if (t[decodedSegment as keyof typeof t]) {
    return t[decodedSegment as keyof typeof t];
  }

  // Fallback to capitalizing the segment if no translation is found
  return decodedSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = breadcrumbTranslations[language];
  
  const segments = pathname.split('/').filter(Boolean);
  const noBreadcrumbPaths = ['/login', '/register'];
  const MAX_VISIBLE_SEGMENTS = 2;

  // Don't render breadcrumbs on specified paths
  if (noBreadcrumbPaths.includes(pathname)) {
    return null;
  }

  // Handle the home page case specifically
  if (segments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-primary">
                {t.home}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-3">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Leading separator and Home Link */}
          <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-sm text-primary hover:underline">
                {t.home}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Conditional Rendering for Ellipsis */}
          {segments.length > MAX_VISIBLE_SEGMENTS ? (
            <>
              <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              {/* Render last two segments for collapsed view */}
              {segments.slice(-2).map((segment, index) => {
                const overallIndex = segments.length - 2 + index;
                const href = `/${segments.slice(0, overallIndex + 1).join('/')}`;
                const isLast = index === 1;
                const formattedSegment = formatSegment(segment, t);
                const renderAsPage = isLast && href !== '/about';

                return (
                  <Fragment key={href}>
                    <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
                    <BreadcrumbItem>
                      {renderAsPage ? (
                        <BreadcrumbPage className="truncate max-w-28 sm:max-w-48 md:max-w-none text-sm font-medium text-foreground">
                          {formattedSegment}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href} className="text-sm text-primary hover:underline truncate max-w-28 sm:max-w-48 md:max-w-none">
                            {formattedSegment}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </>
          ) : (
            <>
              {/* Render all segments for normal view */}
              {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join('/')}`;
                const isLast = index === segments.length - 1;
                const formattedSegment = formatSegment(segment, t);
                const renderAsPage = isLast && href !== '/about';

                return (
                  <Fragment key={href}>
                    <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
                    <BreadcrumbItem>
                      {renderAsPage ? (
                        <BreadcrumbPage className="truncate max-w-28 sm:max-w-48 md:max-w-none text-sm font-medium text-foreground">
                          {formattedSegment}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href} className="text-sm text-primary hover:underline truncate max-w-28 sm:max-w-48 md:max-w-none">
                            {formattedSegment}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}