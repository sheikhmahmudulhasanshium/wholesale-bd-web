// @/app/(routes)/cart/components/cart-page-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Header } from "@/app/components/common/header"
import Footer from "@/app/components/common/footer"

export const CartPageSkeleton = () => {
  const SkeletonItem = () => (
    <div className="p-4">
      <div className="flex flex-col xs:flex-row items-start gap-4">
        <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-md flex-shrink-0 mx-auto xs:mx-0" />
        <div className="flex-grow space-y-3 w-full">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-7 w-24 self-end sm:self-center" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="sticky top-0 z-40 bg-background">
        <div className="md:hidden border-b flex items-center p-2 h-12">
           <Skeleton className="h-10 w-10" />
        </div>
        <div className="hidden md:block">
           <Skeleton className="h-14 w-full border-b" />
        </div>
      </div>
      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-10 w-full max-w-lg" />
              <Card>
                <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent className="divide-y p-0">
                  <SkeletonItem />
                  <SkeletonItem />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4 lg:sticky top-24">
              <Card>
                <CardHeader><Skeleton className="h-7 w-2/5" /></CardHeader>
                <CardContent><Skeleton className="h-6 w-full" /></CardContent>
                <CardFooter className="flex flex-col gap-3 pt-6">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};