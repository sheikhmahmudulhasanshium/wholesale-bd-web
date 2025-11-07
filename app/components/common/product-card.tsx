// @/app/home/product-card.tsx (or common/product-card.tsx) - KEEP THIS VERSION

"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  language: 'en' | 'bn';
  isEditable?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isEditable = false }) => {
  const router = useRouter(); 
  
  const displayName = product.name; 
  const imageUrl = product.thumbnail?.url || '/logo/logo.png';

  const priceInfo = useMemo(() => {
    const tiers = product.pricingTiers || [];
    const validTierPrices = tiers.map(tier => tier.pricePerUnit).filter(price => typeof price === 'number' && price > 0);

    let regularPrice = product.regularUnitPrice;
    if (!regularPrice || regularPrice === 0) {
      if (validTierPrices.length > 0) {
        regularPrice = Math.max(...validTierPrices);
      } else {
        regularPrice = 0;
      }
    }
    
    let displayPrice = regularPrice;
    if (validTierPrices.length > 0) {
      displayPrice = Math.min(...validTierPrices);
    }

    let discountPercent = 0;
    if (regularPrice > 0 && displayPrice < regularPrice) {
      discountPercent = Math.round(((regularPrice - displayPrice) / regularPrice) * 100);
    }
    
    return {
      regularPrice,
      displayPrice,
      discountPercent,
      hasDiscount: discountPercent > 0,
    };
  }, [product.regularUnitPrice, product.pricingTiers]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/products/${product._id}/edit-product`);
  };

  return (
    <Link href={`/products/${product._id}`} className="group relative">
      <div className="border rounded-lg p-2 text-center overflow-hidden flex flex-col h-full transition-shadow duration-200 group-hover:shadow-md">
        
        {isEditable && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute top-2 right-2 z-20 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Product</span>
          </Button>
        )}

        {priceInfo.hasDiscount && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            {priceInfo.discountPercent}% OFF
          </div>
        )}

        <div className="relative w-full aspect-square bg-muted rounded-md mb-2 overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={displayName} 
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        <div className="flex-grow flex flex-col justify-between p-1">
          <h4 className="font-semibold text-sm truncate text-left">
            {displayName}
          </h4>
          
          <div className="flex flex-col items-start mt-1">
            {priceInfo.hasDiscount ? (
              <>
                <p className="text-primary font-bold text-base">
                  ৳{priceInfo.displayPrice.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs line-through">
                  ৳{priceInfo.regularPrice.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-primary font-bold text-base">
                ৳{priceInfo.regularPrice.toLocaleString()}
              </p>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
};