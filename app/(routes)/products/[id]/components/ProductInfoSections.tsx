// @/app/(routes)/products/[id]/components/ProductInfoSections.tsx

"use client";

import React from 'react';
import { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Weight, Ruler, Scan } from 'lucide-react';

interface ProductInfoSectionsProps {
  product: Product;
}

export const ProductInfoSections: React.FC<ProductInfoSectionsProps> = ({ product }) => (
  <div className="space-y-8">
    <Card>
      <CardHeader>
        <CardTitle>Product Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Brand</span>
          <span className="font-semibold">{product.brand}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Model</span>
          <span className="font-semibold">{product.model}</span>
        </div>
        {product.weight && (
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Weight
            </span>
            <span className="font-semibold">{product.weight} kg</span>
          </div>
        )}
        {product.dimensions && (
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Dimensions
            </span>
            <span className="font-semibold">{product.dimensions}</span>
          </div>
        )}
        {product.sku && (
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Scan className="h-4 w-4" />
              SKU
            </span>
            <span className="font-semibold">{product.sku}</span>
          </div>
        )}
        {product.specifications && (
          <div className="pt-4 border-t">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {product.specifications}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);