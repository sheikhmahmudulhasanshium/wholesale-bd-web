// @/app/(routes)/products/[id]/components/PurchaseCard.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Product, Zone } from '@/lib/types';
import apiClient from '@/lib/apiClient';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Package as PackageIcon, ShoppingCart } from 'lucide-react';

const ZoneDisplay = ({ zoneId }: { zoneId: string }) => {
  const [zone, setZone] = useState<Zone | null>(null);
  useEffect(() => {
    apiClient.zones.findAll().then((res) => {
      const foundZone = res.data.find((z) => z._id === zoneId);
      if (foundZone) setZone(foundZone);
    });
  }, [zoneId]);

  if (!zone) return <Skeleton className="h-5 w-24" />;
  return <span>{zone.name}</span>;
};

interface PurchaseCardProps {
  product: Product;
  onAddToCartClick: () => void;
  isOwner: boolean;
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({ product, onAddToCartClick, isOwner }) => {
  return (
    // --- CHANGE: Added id="add-to-cart" to make this card a scroll target ---
    <Card id="add-to-cart">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <PackageIcon className="h-5 w-5" /> In Stock:
          </div>
          <Badge variant={product.stockQuantity > 0 ? 'default' : 'destructive'}>
            {product.stockQuantity} {product.unit}(s)
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <MapPin className="h-5 w-5" /> Shipping From:
          </div>
          <span className="font-semibold">
            <ZoneDisplay zoneId={product.zoneId} />
          </span>
        </div>
        <Button size="lg" className="w-full text-lg mt-4 h-12" onClick={onAddToCartClick} disabled={isOwner}>
          {isOwner ? (
            'This is your product'
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};