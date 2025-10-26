// @/app/components/products/product-card.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Used for the image placeholder
import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  language: 'en' | 'bn';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, language }) => {
  // --- MODIFICATION: Simplified as requested ---
  // Always use the English name for now
  const displayName = product.name; 
  
  const displayPrice = product.pricingTiers?.length > 0 
    ? product.pricingTiers[0].pricePerUnit 
    : 0;

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="border rounded-lg p-2 text-center overflow-hidden flex flex-col h-full transition-shadow duration-200 group-hover:shadow-md">
        <div className="relative w-full aspect-square bg-muted rounded-md mb-2 overflow-hidden">
          {/* --- MODIFICATION: Image placeholder as requested --- */}
          {/* This area will be updated later with your new hook */}
          <Skeleton className="w-full h-full" >
            <Image src={'/logo/logo.png'} alt='' height={100} width={100} />
          </Skeleton>
        </div>
        <div className="flex-grow flex flex-col justify-between">
          <h4 className="font-semibold text-sm truncate px-1 text-left">
            {displayName}
          </h4>
          <p className="text-primary font-bold text-base text-left mt-1">
            ৳{displayPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};