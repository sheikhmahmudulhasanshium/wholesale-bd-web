// @/app/(routes)/products/[id]/components/ProductStats.tsx

"use client";

import React from 'react';
import { Star, MessageSquare, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProductStatsProps {
  rating: number;
  reviewCount: number;
  viewCount: number;
}

export const ProductStats: React.FC<ProductStatsProps> = ({ rating, reviewCount, viewCount }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
    <div className="flex items-center gap-1.5">
      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
    </div>
    <Separator orientation="vertical" className="h-4" />
    <div className="flex items-center gap-1.5">
      <MessageSquare className="h-4 w-4" />
      <span>{reviewCount} Reviews</span>
    </div>
    <Separator orientation="vertical" className="h-4" />
    <div className="flex items-center gap-1.5">
      <Eye className="h-4 w-4" />
      <span>{viewCount} Views</span>
    </div>
  </div>
);