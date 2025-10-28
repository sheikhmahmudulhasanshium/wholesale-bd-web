"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // <-- Import useRouter
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  language: 'en' | 'bn';
  isEditable?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, language, isEditable = false }) => {
  const router = useRouter(); // <-- Initialize the router

  const displayName = product.name; 
  
  const displayPrice = product.pricingTiers?.length > 0 
    ? product.pricingTiers[0].pricePerUnit 
    : 0;

  const imageUrl = product.thumbnail?.url || '/logo/logo.png';

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // --- Use router.push() for efficient client-side navigation ---
    router.push(`/products/${product._id}/edit-product`);
  };

  return (
    <Link href={`/products/${product._id}`} className="group relative">
      {isEditable && (
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-2 right-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit Product</span>
        </Button>
      )}
      <div className="border rounded-lg p-2 text-center overflow-hidden flex flex-col h-full transition-shadow duration-200 group-hover:shadow-md">
        <div className="relative w-full aspect-square bg-muted rounded-md mb-2 overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={displayName} 
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105" 
          />
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