// @/app/(routes)/cart/components/cart-item-card.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Minus, Plus, Trash2, Loader2, AlertTriangle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CartSearchResult, ProductDetails } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface CartItemCardProps {
  item: CartSearchResult;
  currencyFormatter: Intl.NumberFormat;
  onTriggerRemove: () => void;
  onUpdateQuantity: (newQuantity: number) => void;
  details?: ProductDetails;
  hasWarning: boolean;
  // --- VVVVVV NEW PROP FOR THE CORRECT PRICE VVVVVV ---
  clientSideItemTotal: number;
  // --- ^^^^^^ END OF NEW PROP ^^^^^^ ---
}

export const CartItemCard = ({ 
  item, 
  currencyFormatter, 
  onTriggerRemove, 
  onUpdateQuantity, 
  details, 
  hasWarning,
  clientSideItemTotal 
}: CartItemCardProps) => {
  const [isUpdatingQty, setIsUpdatingQty] = useState(false);
  const [inputValue, setInputValue] = useState(item.quantity.toString());
  
  const minimumOrderQuantity = details?.minimumOrderQuantity || 1;
  const thumbnailUrl = details?.thumbnailUrl;

  const allWarnings = useMemo(() => {
    let warnings = [...item.warnings];
    warnings = warnings.filter(w => !w.toLowerCase().includes('minimum order'));
    if (item.quantity < minimumOrderQuantity) {
      warnings.push(`The minimum order for this item is ${minimumOrderQuantity}.`);
    }
    return warnings;
  }, [item.warnings, item.quantity, minimumOrderQuantity]);

  useEffect(() => {
    if (!isUpdatingQty) {
      setInputValue(item.quantity.toString());
    }
  }, [item.quantity, isUpdatingQty]);

  useEffect(() => {
    const newQuantity = parseInt(inputValue, 10);
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity !== item.quantity) {
      if (newQuantity < minimumOrderQuantity) return; 
      const handler = setTimeout(async () => {
        await onUpdateQuantity(newQuantity);
        setIsUpdatingQty(false);
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [inputValue, item.quantity, onUpdateQuantity, minimumOrderQuantity]);

  const handleImmediateUpdate = async (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity < minimumOrderQuantity) {
      toast.error(`Minimum order quantity for this item is ${minimumOrderQuantity}.`);
      setInputValue(minimumOrderQuantity.toString()); 
      return;
    }
    if (newQuantity <= 0) {
      onTriggerRemove();
      return;
    }
    setIsUpdatingQty(true);
    await onUpdateQuantity(newQuantity);
    setTimeout(() => setIsUpdatingQty(false), 500);
  };
  
  const handleSliderChange = (value: number[]) => {
    const newQuantity = value[0];
    if (newQuantity <= 0) return;
    setInputValue(newQuantity.toString());
    setIsUpdatingQty(true);
  };

  const handleBlur = () => {
    const newQuantity = parseInt(inputValue, 10);
    if (!isNaN(newQuantity) && newQuantity !== item.quantity) {
      handleImmediateUpdate(newQuantity);
    } else {
      setInputValue(item.quantity.toString());
    }
  };

  return (
    <div className={cn(
      "p-4 transition-colors duration-200 hover:bg-muted/50 rounded-lg",
      hasWarning && "border-l-4 border-destructive bg-destructive/5 hover:bg-destructive/10"
    )}>
      <div className="flex flex-row items-start gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
           {!details ? (
             <Skeleton className="h-full w-full" />
           ) : (
             <Image 
                src={thumbnailUrl || '/logo/logo.png'} 
                alt={item.product.name} 
                fill
                sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 96px"
                className="object-contain" 
             />
           )}
        </div>
        
        <div className="flex flex-col flex-grow gap-2 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-grow min-w-0 pr-2">
              <Link href={`/products/${item.product._id}`} className="font-semibold hover:underline truncate block text-base leading-tight" title={item.product.name}>
                {item.product.name}
              </Link>
              <p className="text-xs text-muted-foreground truncate">
                Sold by: {item.seller.businessName}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={onTriggerRemove}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Remove Item</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2 mt-auto">
            <div className="sm:hidden flex flex-col w-full gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Quantity:</span>
                <span className="font-bold text-lg">{inputValue}</span>
              </div>
              <Slider
                value={[parseInt(inputValue, 10) || 1]}
                onValueChange={handleSliderChange}
                min={minimumOrderQuantity}
                max={1000}
                step={1}
                disabled={isUpdatingQty}
              />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => handleImmediateUpdate(item.quantity - 1)} disabled={isUpdatingQty}><Minus className="h-4 w-4" /></Button>
              <Input 
                type="number" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
                className="h-8 w-16 text-center font-bold" 
                disabled={isUpdatingQty} 
                min={minimumOrderQuantity}
              />
              <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => handleImmediateUpdate(item.quantity + 1)} disabled={isUpdatingQty}><Plus className="h-4 w-4" /></Button>
            </div>
            
            {isUpdatingQty && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            
            <div className="text-right ml-auto">
              <p className="font-bold text-lg text-primary">
                {/* --- VVVVVV USE THE CORRECTED PRICE PROP VVVVVV --- */}
                {currencyFormatter.format(clientSideItemTotal)}
                {/* --- ^^^^^^ END OF CHANGE ^^^^^^ --- */}
              </p>
            </div>
          </div>
          
          {allWarnings.length > 0 && (
            <div className="mt-2 space-y-1 w-full">
              {allWarnings.map((warning, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-md"><AlertTriangle className="h-4 w-4 flex-shrink-0" /><span>{warning}</span></div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};