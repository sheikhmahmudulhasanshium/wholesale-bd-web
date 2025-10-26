"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";

import { Product } from "@/lib/types";
import { useLanguage } from "@/app/components/contexts/language-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

interface AddToCartModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export const AddToCartModal = ({ isOpen, onOpenChange, product }: AddToCartModalProps) => {
    const { language } = useLanguage();
    const sortedTiers = useMemo(() => product.pricingTiers.sort((a, b) => a.minQuantity - b.minQuantity), [product.pricingTiers]);

    // --- Base price is the price of the first tier ---
    const basePrice = sortedTiers[0]?.pricePerUnit || 0;

    const [selectedTierKey, setSelectedTierKey] = useState<string>(sortedTiers[0]?.minQuantity.toString() || 'custom');
    const [customQuantity, setCustomQuantity] = useState<number | string>(product.minimumOrderQuantity);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { onOpenChange(false); } };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            setSelectedTierKey(sortedTiers[0]?.minQuantity.toString() || 'custom');
            setCustomQuantity(product.minimumOrderQuantity);
        }
        return () => { document.removeEventListener('keydown', handleKeyDown); };
    }, [isOpen, onOpenChange, product.minimumOrderQuantity, sortedTiers]);

    const formatter = new Intl.NumberFormat(language === "bn" ? "bn-BD" : "en-US", { style: "currency", currency: "BDT" });

    const quantity = useMemo(() => (selectedTierKey === 'custom' ? Number(customQuantity) || 0 : Number(selectedTierKey) || 0), [selectedTierKey, customQuantity]);
    
    const pricePerUnit = useMemo(() => {
        let activePrice = sortedTiers[0]?.pricePerUnit || 0;
        for (const tier of sortedTiers) if (quantity >= tier.minQuantity) activePrice = tier.pricePerUnit;
        return activePrice;
    }, [quantity, sortedTiers]);

    const totalPrice = quantity * pricePerUnit;
    const isMinQuantityMet = quantity >= product.minimumOrderQuantity;
    const isStockAvailable = quantity <= product.stockQuantity;
    const errorMessage = !isMinQuantityMet ? `Minimum order quantity is ${product.minimumOrderQuantity}.` : !isStockAvailable ? `Cannot exceed available stock of ${product.stockQuantity}.` : null;

    const handleCustomQuantityChange = (value: string) => {
        if (value === '' || /^[0-9]+$/.test(value)) {
            const numValue = Math.min(Number(value), product.stockQuantity);
            setCustomQuantity(value === '' ? '' : numValue);
        }
    };
    
    const adjustCustomQuantity = (amount: number) => {
        const currentQty = Number(customQuantity) || 0;
        const newQty = Math.max(1, Math.min(currentQty + amount, product.stockQuantity));
        setCustomQuantity(newQty);
    };

    const handleConfirm = () => {
        toast.success(`${quantity} x ${product.name} added to cart!`, { description: `Total: ${formatter.format(totalPrice)}` });
        onOpenChange(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => onOpenChange(false)}>
            <div className="relative flex flex-col w-full max-w-md lg:max-w-lg max-h-[90vh] bg-background rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onOpenChange(false)} className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground z-10"><X className="h-5 w-5" /><span className="sr-only">Close</span></button>
                <div className="p-6 border-b"><h2 className="text-lg font-semibold text-foreground">{product.name}</h2><p className="text-sm text-muted-foreground">Add to your cart</p><Badge variant="secondary" className="mt-2">Stock: {product.stockQuantity}</Badge></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <RadioGroup value={selectedTierKey} onValueChange={setSelectedTierKey} className="space-y-3">
                        {sortedTiers.map(tier => {
                            const discount = basePrice > 0 && tier.pricePerUnit < basePrice ? Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100) : 0;
                            return (
                                <Label key={tier.minQuantity} htmlFor={tier.minQuantity.toString()} className={cn("flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer", selectedTierKey === tier.minQuantity.toString() ? 'border-primary bg-primary/5' : 'hover:bg-muted/50')}>
                                    <RadioGroupItem value={tier.minQuantity.toString()} id={tier.minQuantity.toString()} />
                                    <div className="flex justify-between items-center w-full">
                                        <div className="font-semibold">
                                            Qty {tier.minQuantity}{tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+'}
                                            {discount > 0 && <Badge variant="destructive" className="ml-2">SAVE {discount}%</Badge>}
                                        </div>
                                        <div className="font-bold text-primary">{formatter.format(tier.pricePerUnit)}</div>
                                    </div>
                                </Label>
                            );
                        })}
                        <Label htmlFor="custom" className={cn("flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer", selectedTierKey === 'custom' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50')}>
                            <RadioGroupItem value="custom" id="custom" />
                            <span className="font-semibold">Custom Quantity</span>
                        </Label>
                    </RadioGroup>
                    {selectedTierKey === 'custom' && (<div className="pl-10 pt-2 space-y-2"><div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => adjustCustomQuantity(-1)}><Minus className="h-4 w-4" /></Button><Input type="text" value={customQuantity} onChange={(e) => handleCustomQuantityChange(e.target.value)} className="text-center font-bold text-lg" /><Button variant="outline" size="icon" onClick={() => adjustCustomQuantity(1)}><Plus className="h-4 w-4" /></Button></div></div>)}
                    {errorMessage && <p className="text-sm text-destructive text-center pt-2">{errorMessage}</p>}
                </div>
                <div className="p-6 border-t space-y-4">
                    <div className="w-full flex justify-between items-center bg-muted p-4 rounded-lg"><span className="text-muted-foreground">Total Price</span><span className="text-2xl font-bold">{formatter.format(totalPrice)}</span></div>
                    <Button type="button" size="lg" className="w-full h-12" onClick={handleConfirm} disabled={!!errorMessage}><ShoppingCart className="mr-2 h-5 w-5" />Add to Cart</Button>
                    <Button type="button" variant="outline" size="lg" className="w-full h-12 bg-accent" onClick={() => onOpenChange(false)}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};