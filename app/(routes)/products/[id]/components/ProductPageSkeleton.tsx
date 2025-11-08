// @/app/(routes)/products/[id]/components/ProductPageSkeleton.tsx

"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductPageSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
    <div className="lg:col-span-7 space-y-8">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
    <div className="lg:col-span-5 space-y-6">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);