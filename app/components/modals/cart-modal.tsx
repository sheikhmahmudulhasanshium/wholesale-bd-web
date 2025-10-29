"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Minus, Plus, X, ShoppingCart, Ban } from "lucide-react";

import { Product } from "@/lib/types";
import { useLanguage } from "@/app/components/contexts/language-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/auth-context";
import { Slider } from "@/components/ui/slider";

interface AddToCartModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export const AddToCartModal = ({ isOpen, onOpenChange, product }: AddToCartModalProps) => {
    const { language } = useLanguage();
    const { user } = useAuth();
    const sortedTiers = useMemo(() => product.pricingTiers.sort((a, b) => a.minQuantity - b.minQuantity), [product.pricingTiers]);

    const [orderQuantity, setOrderQuantity] = useState<number>(product.minimumOrderQuantity);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { onOpenChange(false); } };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            setOrderQuantity(product.minimumOrderQuantity);
        }
        return () => { document.removeEventListener('keydown', handleKeyDown); };
    }, [isOpen, onOpenChange, product.minimumOrderQuantity]);
    
    const numberFormatter = useMemo(() => new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US'), [language]);
    const currencyFormatter = useMemo(() => new Intl.NumberFormat(language === "bn" ? "bn-BD" : "en-US", { style: "currency", currency: "BDT" }), [language]);

    // --- V FIX: Wrap the 't' object in useMemo ---
    const t = useMemo(() => ({
        stock: language === 'bn' ? 'স্টক' : 'Stock',
        orderQuantity: language === 'bn' ? 'অর্ডারের পরিমাণ' : 'Order Quantity',
        pricingTiers: language === 'bn' ? 'মূল্য তালিকা' : 'Pricing Tiers',
        qty: language === 'bn' ? 'পরিমাণ' : 'Qty',
        save: language === 'bn' ? 'বাঁচান' : 'SAVE',
        totalPrice: language === 'bn' ? 'মোট মূল্য' : 'Total Price',
        addToCart: language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart',
        yourProduct: language === 'bn' ? 'এটি আপনার পণ্য' : 'This is your product',
        cancel: language === 'bn' ? 'বাতিল করুন' : 'Cancel',
        toastSuccessTitle: language === 'bn' ? 'আপনার পণ্য কার্টে যোগ করা হয়েছে।' : 'Your item has been added to the cart.',
        toastSuccessDescription: language === 'bn' ? 'আরও পণ্য যোগ করতে কেনাকাটা চালিয়ে যেতে পারেন। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।' : 'You can continue shopping to add more products. Our team will contact you soon.',
        errorIsOwner: language === 'bn' ? 'আপনি নিজের পণ্য কার্টে যোগ করতে পারবেন না।' : 'You cannot add your own product to the cart.',
        errorMinQuantity: language === 'bn' ? 'সর্বনিম্ন অর্ডারের পরিমাণ {quantity}।' : 'Minimum order quantity is {quantity}.',
        errorMaxStock: language === 'bn' ? 'স্টকে {quantity} এর বেশি নেই।' : `Cannot exceed available stock of {quantity}.`,
    }), [language]);
    // --- ^ END of FIX ---

    const pricePerUnit = useMemo(() => {
        let activePrice = sortedTiers[0]?.pricePerUnit || 0;
        for (const tier of sortedTiers) {
            if (orderQuantity >= tier.minQuantity) {
                activePrice = tier.pricePerUnit;
            }
        }
        return activePrice;
    }, [orderQuantity, sortedTiers]);

    const activeTierMinQuantity = useMemo(() => {
        let activeMinQty = 0;
        for (const tier of sortedTiers) {
            if (orderQuantity >= tier.minQuantity) {
                activeMinQty = tier.minQuantity;
            }
        }
        return activeMinQty;
    }, [orderQuantity, sortedTiers]);

    const totalPrice = orderQuantity * pricePerUnit;
    const isOwner = user?._id === product.sellerId;

    const errorMessage = useMemo(() => {
        if (isOwner) {
            return t.errorIsOwner;
        }
        if (orderQuantity < product.minimumOrderQuantity) {
            return t.errorMinQuantity.replace('{quantity}', numberFormatter.format(product.minimumOrderQuantity));
        }
        if (orderQuantity > product.stockQuantity) {
            return t.errorMaxStock.replace('{quantity}', numberFormatter.format(product.stockQuantity));
        }
        return null;
    }, [isOwner, orderQuantity, product.minimumOrderQuantity, product.stockQuantity, t, numberFormatter]);

    const handleQuantityChange = (newQuantity: number) => {
        if (isNaN(newQuantity)) {
            setOrderQuantity(product.minimumOrderQuantity);
            return;
        }
        const clampedQuantity = Math.max(
            product.minimumOrderQuantity,
            Math.min(newQuantity, product.stockQuantity)
        );
        setOrderQuantity(clampedQuantity);
    };

    const handleConfirm = () => {
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }

        const cartPayload = {
            productId: product._id,
            productName: product.name,
            sellerId: product.sellerId,
            customerId: user?._id,
            orderAmount: orderQuantity,
            sellerZone: product.zoneId,
            stockAmount: product.stockQuantity,
            pricePerUnit: pricePerUnit,
            totalPrice: totalPrice,
            timestamp: new Date().toISOString(),
        };

        console.log("--- Cart Item Payload (for future API) ---");
        console.log(JSON.stringify(cartPayload, null, 2));

        toast.success(t.toastSuccessTitle, { 
            description: t.toastSuccessDescription,
            duration: 5000
        });
        onOpenChange(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => onOpenChange(false)}>
            <div className="relative flex flex-col w-full max-w-md lg:max-w-lg max-h-[90vh] bg-background rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onOpenChange(false)} className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground z-10"><X className="h-5 w-5" /><span className="sr-only">Close</span></button>
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-foreground">{product.name}</h2>
                    <p className="text-sm text-muted-foreground">Add to your cart</p>
                    <Badge variant="secondary" className="mt-2">{t.stock}: {numberFormatter.format(product.stockQuantity)}</Badge>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">{t.pricingTiers}</Label>
                        <RadioGroup value={activeTierMinQuantity.toString()} disabled className="space-y-3">
                            {sortedTiers.map(tier => {
                                const basePrice = sortedTiers[0].pricePerUnit;
                                const discount = basePrice > 0 && tier.pricePerUnit < basePrice ? Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100) : 0;
                                const isActive = activeTierMinQuantity === tier.minQuantity;
                                return (
                                    <Label key={tier.minQuantity} htmlFor={tier.minQuantity.toString()} className={cn("flex items-center gap-4 p-4 rounded-lg border transition-all cursor-default", isActive ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'bg-muted/50')}>
                                        <RadioGroupItem value={tier.minQuantity.toString()} id={tier.minQuantity.toString()} />
                                        <div className="flex justify-between items-center w-full">
                                            <div className="font-semibold">
                                                {t.qty} {numberFormatter.format(tier.minQuantity)}{tier.maxQuantity ? ` - ${numberFormatter.format(tier.maxQuantity)}` : '+'}
                                                {discount > 0 && <Badge variant="destructive" className="ml-2">{t.save} {numberFormatter.format(discount)}%</Badge>}
                                            </div>
                                            <div className={cn("font-bold", isActive ? "text-primary" : "text-foreground")}>{currencyFormatter.format(tier.pricePerUnit)}</div>
                                        </div>
                                    </Label>
                                );
                            })}
                        </RadioGroup>
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="order-quantity" className="text-base font-semibold">{t.orderQuantity}</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(orderQuantity - 1)}><Minus className="h-4 w-4" /></Button>
                            <Input 
                                id="order-quantity"
                                type="text"
                                value={orderQuantity} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityChange(parseInt(e.target.value, 10))} 
                                className="text-center font-bold text-lg h-10" 
                            />
                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(orderQuantity + 1)}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <Slider
                            value={[orderQuantity]}
                            onValueChange={(value: number[]) => handleQuantityChange(value[0])}
                            min={product.minimumOrderQuantity}
                            max={product.stockQuantity}
                            step={1}
                        />
                    </div>

                    {errorMessage && <p className="text-sm text-destructive text-center pt-2">{errorMessage}</p>}
                </div>
                <div className="p-6 border-t space-y-4">
                    <div className="w-full flex justify-between items-center bg-muted p-4 rounded-lg">
                        <span className="text-muted-foreground">{t.totalPrice}</span>
                        <span className="text-2xl font-bold">{currencyFormatter.format(totalPrice)}</span>
                    </div>
                    <Button type="button" size="lg" className="w-full h-12" onClick={handleConfirm} disabled={!!errorMessage}>
                        {isOwner ? (
                            <>
                                <Ban className="mr-2 h-5 w-5" />
                                {t.yourProduct}
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {t.addToCart}
                            </>
                        )}
                    </Button>
                    <Button type="button" variant="outline" size="lg" className="w-full h-12 bg-accent" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
                </div>
            </div>
        </div>
    );
};