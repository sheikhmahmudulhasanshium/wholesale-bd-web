"use client";

import React from 'react';
import { ProductCard } from './product-card';
import { CollectionProduct } from '@/lib/types';

interface ProductGridProps {
  products: CollectionProduct[];
  language: 'en' | 'bn';
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, language }) => {
  if (!products || products.length === 0) {
    return <p className='text-muted-foreground'>{language === 'bn' ? 'এই সংগ্রহে কোনো পণ্য পাওয়া যায়নি।' : 'No products found in this collection.'}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map(({ product }) => (
        <ProductCard key={product._id} product={product} language={language} />
      ))}
    </div>
  );
};