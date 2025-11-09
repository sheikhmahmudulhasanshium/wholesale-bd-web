// @/app/(routes)/products/[id]/components/PricingCard.tsx

"use client";

import React from 'react';
import { Product } from '@/lib/types';
import { useLanguage } from '@/app/components/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign as DollarSignIcon } from 'lucide-react';

// Sub-component for the tier list, kept inside for encapsulation
const PricingTiersList = ({ tiers, unit, regularPrice }: { tiers: Product['pricingTiers']; unit: string; regularPrice?: number; }) => {
  const { language } = useLanguage();
  const formatter = new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', { style: 'currency', currency: 'BDT' });

  if (!tiers || tiers.length === 0) {
    return null;
  }

  const basePrice = regularPrice && regularPrice > 0 ? regularPrice : Math.max(...tiers.map((t) => t.pricePerUnit));

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground mb-3">Discount Tier:</p>
      {tiers.sort((a, b) => a.minQuantity - b.minQuantity).map((tier, index) => {
        let discountPercent = 0;
        if (basePrice && tier.pricePerUnit < basePrice) {
          discountPercent = Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100);
        }

        return (
          <div key={index} className="grid grid-cols-12 items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="col-span-2 flex justify-start">
              {discountPercent > 0 ? <Badge variant="destructive" className='text-base'>-{discountPercent}%</Badge>:<Badge variant={'default'}>Regular</Badge>}
            </div>
            <div className="col-span-5 text-center sm:text-wrap font-semibold text-card-foreground">
              {tier.minQuantity}{tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+'}
              <span className="ml-1 font-normal text-muted-foreground">{unit}(s)</span>
            </div>
            <div className="col-span-5 text-right">
              {discountPercent > 0 && <p className="text-xs text-muted-foreground line-through">{formatter.format(basePrice as number)}</p>}
              <p className="font-bold text-lg text-primary -mt-1">{formatter.format(tier.pricePerUnit)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface PricingCardProps {
  product: Product;
}

export const PricingCard: React.FC<PricingCardProps> = ({ product }) => {
  const { language } = useLanguage();
  const formatter = new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', { style: 'currency', currency: 'BDT' });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSignIcon className="h-6 w-6" /> Pricing
        </CardTitle>
        <CardDescription>
          Minimum order: {product.minimumOrderQuantity} {product.unit}(s)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.regularUnitPrice > 0 && (
          <div className="flex justify-between items-baseline p-3 border-b">
            <span className="text-muted-foreground font-medium">Regular Price</span>
            <span className="font-bold text-xl text-foreground">{formatter.format(product.regularUnitPrice)}</span>
          </div>
        )}
        <PricingTiersList
          tiers={product.pricingTiers}
          unit={product.unit}
          regularPrice={product.regularUnitPrice}
        />
      </CardContent>
    </Card>
  );
};