// @/app/components/modals/cart-modal.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Minus, Plus, X, ShoppingCart, Ban, Loader2, MapPin, PackageCheck, Pencil, Phone } from "lucide-react";
import { Product, Zone, AuthenticatedUser, PricingTier } from "@/lib/types";
import { useLanguage } from "@/app/components/contexts/language-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/auth-context";
import { Slider } from "@/components/ui/slider";
import { useCart } from "../contexts/cart-context";
import apiClient from "@/lib/apiClient";
import { Skeleton } from "@/components/ui/skeleton";

// --- Sub-Components & Hooks ---
const useIsDesktop = (breakpoint = 1024) => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= breakpoint);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);
  return isDesktop;
};

const ZoneDisplay = ({ zoneId }: { zoneId: string }) => {
  const [zone, setZone] = useState<Zone | null>(null);
  useEffect(() => {
    apiClient.zones.findAll().then((res) => setZone(res.data.find((z) => z._id === zoneId) || null));
  }, [zoneId]);
  return zone ? <span className="font-semibold text-foreground">{zone.name}</span> : <Skeleton className="h-4 w-20" />;
};

// --- Props Interface for Content Components ---
interface CartContentProps {
  product: Product;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  orderQuantity: number;
  handleQuantityChange: (q: number) => void;
  sortedTiers: Product['pricingTiers'];
  activeTierMinQuantity: number;
  basePrice: number;
  t: Record<string, string>;
  numberFormatter: Intl.NumberFormat;
  currencyFormatter: Intl.NumberFormat;
  isEditingAddress: boolean;
  setIsEditingAddress: (isEditing: boolean) => void;
  editableAddress: string;
  setEditableAddress: (address: string) => void;
  editablePhone: string;
  setEditablePhone: (phone: string) => void;
  handleSaveAddress: () => Promise<void>;
  totalPrice: number;
  errorMessage: string | null;
  isSubmitting: boolean;
  isOwner: boolean;
  handleConfirm: () => Promise<void>;
}

// --- Desktop Layout Component ---
const CartContentDesktop = (props: CartContentProps) => {
  const { product, user, isAuthenticated, orderQuantity, handleQuantityChange, sortedTiers, activeTierMinQuantity, basePrice, t, numberFormatter, currencyFormatter, isEditingAddress, setIsEditingAddress, editableAddress, setEditableAddress, editablePhone, setEditablePhone, handleSaveAddress, totalPrice, errorMessage, isSubmitting, isOwner, handleConfirm } = props;
  
  return (
    <div className="flex-1 grid grid-cols-2 gap-x-8 p-6 overflow-hidden">
      <div className="flex flex-col min-h-0">
        <Label className="text-base font-semibold text-foreground mb-3 flex-shrink-0">{t.discountTiers}</Label>
        <div className="overflow-y-auto space-y-2 pr-2 -mr-2">
          {sortedTiers.map((tier) => {
            const discountPercent = basePrice && tier.pricePerUnit < basePrice ? Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100) : 0;
            return (
              <div key={tier.minQuantity} className={cn("grid grid-cols-12 items-center gap-4 p-3 bg-muted/50 rounded-lg", activeTierMinQuantity === tier.minQuantity && "border border-primary bg-primary/10")}>
                <div className="col-span-3">{discountPercent > 0 ? <Badge variant="destructive" className='text-base'>-{discountPercent}%</Badge> : <Badge variant={'default'}>Regular</Badge>}</div>
                <div className="col-span-5 text-center font-semibold">{numberFormatter.format(tier.minQuantity)}{tier.maxQuantity ? ` - ${numberFormatter.format(tier.maxQuantity)}` : '+'}<span className="ml-1 font-normal text-muted-foreground">{product.unit}(s)</span></div>
                <div className="col-span-4 text-right">{discountPercent > 0 && <p className="text-xs text-muted-foreground line-through">{currencyFormatter.format(basePrice)}</p>}<p className={cn("font-bold text-lg -mt-1", activeTierMinQuantity === tier.minQuantity && "text-primary")}>{currencyFormatter.format(tier.pricePerUnit)}</p></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4"/><span>{t.shippingFrom}:</span></div><ZoneDisplay zoneId={product.zoneId}/></div>
            {isAuthenticated && (<>
              <div className="border-b -mx-4"></div>
              {!isEditingAddress ? (
                <div className="relative pt-1">
                  <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-7 w-7" onClick={() => setIsEditingAddress(true)}><Pencil className="h-4 w-4"/></Button>
                  <div className="space-y-2 pr-8">
                    <div className="flex items-start gap-2 text-sm"><PackageCheck className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground"/><div><span className="text-muted-foreground">{t.shippingTo}: </span><span className="font-semibold text-foreground break-words">{user?.address || 'No address set'}</span></div></div>
                    <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground"/><span className="text-muted-foreground">{t.contactPhone}: </span><span className="font-semibold text-foreground">{user?.phone || 'Not set'}</span></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-2"><Input value={editableAddress} onChange={(e) => setEditableAddress(e.target.value)} placeholder="Enter full address" /><Input value={editablePhone} onChange={(e) => setEditablePhone(e.target.value)} placeholder="Enter contact phone" /><div className="flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setIsEditingAddress(false)}>{t.cancel}</Button><Button size="sm" onClick={handleSaveAddress}>{t.save}</Button></div></div>
              )}
            </>)}
          </div>
          <div className="space-y-4">
            <Label htmlFor="order-quantity" className="text-base font-semibold">{t.orderQuantity}</Label>
            <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => handleQuantityChange(orderQuantity - 1)}><Minus className="h-4 w-4" /></Button><Input id="order-quantity" type="number" value={orderQuantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))} className="text-center font-bold text-lg h-10"/><Button variant="outline" size="icon" onClick={() => handleQuantityChange(orderQuantity + 1)}><Plus className="h-4 w-4" /></Button></div>
            <Slider value={[orderQuantity]} onValueChange={(v) => handleQuantityChange(v[0])} min={0} max={product.stockQuantity} step={1}/>
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <div className="w-full flex justify-between items-center bg-muted p-4 rounded-lg"><span className="text-muted-foreground">{t.totalPrice}</span><span className="text-2xl font-bold">{currencyFormatter.format(totalPrice)}</span></div>
          {errorMessage && <p className="text-sm text-destructive text-center">{errorMessage}</p>}
          <Button type="button" size="lg" className="w-full h-12" onClick={handleConfirm} disabled={!!errorMessage || isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isOwner ? <><Ban className="mr-2 h-5 w-5" />{t.yourProduct}</> : <><ShoppingCart className="mr-2 h-5 w-5" />{t.addToCart}</>}</Button>
        </div>
      </div>
    </div>
  );
};

// --- Mobile Layout Component ---
const CartContentMobile = (props: CartContentProps) => {
  const { product, user, isAuthenticated, orderQuantity, handleQuantityChange, sortedTiers, activeTierMinQuantity, basePrice, t, numberFormatter, currencyFormatter, isEditingAddress, setIsEditingAddress, editableAddress, setEditableAddress, editablePhone, setEditablePhone, handleSaveAddress, totalPrice, errorMessage, isSubmitting, isOwner, handleConfirm } = props;
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="space-y-3 p-4 border rounded-lg bg-muted/30 flex-shrink-0">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4"/><span>{t.shippingFrom}:</span></div><ZoneDisplay zoneId={product.zoneId}/></div>
          {isAuthenticated && (<>
            <div className="border-b -mx-4"></div>
            {!isEditingAddress ? (
              <div className="relative pt-1">
                <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-7 w-7" onClick={() => setIsEditingAddress(true)}><Pencil className="h-4 w-4"/></Button>
                <div className="space-y-2 pr-8">
                  <div className="flex items-start gap-2 text-sm"><PackageCheck className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground"/><div><span className="text-muted-foreground">{t.shippingTo}: </span><span className="font-semibold text-foreground break-words">{user?.address || 'No address set'}</span></div></div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground"/><span className="text-muted-foreground">{t.contactPhone}: </span><span className="font-semibold text-foreground">{user?.phone || 'Not set'}</span></div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-2"><Input value={editableAddress} onChange={(e) => setEditableAddress(e.target.value)} placeholder="Enter full address" /><Input value={editablePhone} onChange={(e) => setEditablePhone(e.target.value)} placeholder="Enter contact phone" /><div className="flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setIsEditingAddress(false)}>{t.cancel}</Button><Button size="sm" onClick={handleSaveAddress}>{t.save}</Button></div></div>
            )}
          </>)}
        </div>
        <div className="space-y-4 flex-shrink-0">
          <Label htmlFor="order-quantity-mobile" className="text-base font-semibold">{t.orderQuantity}</Label>
          <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => handleQuantityChange(orderQuantity - 1)}><Minus className="h-4 w-4" /></Button><Input id="order-quantity-mobile" type="number" value={orderQuantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))} className="text-center font-bold text-lg h-10"/><Button variant="outline" size="icon" onClick={() => handleQuantityChange(orderQuantity + 1)}><Plus className="h-4 w-4" /></Button></div>
          <Slider value={[orderQuantity]} onValueChange={(v) => handleQuantityChange(v[0])} min={0} max={product.stockQuantity} step={1}/>
        </div>
        <div className="flex flex-col min-h-0">
          <Label className="text-base font-semibold text-foreground mb-3 flex-shrink-0">{t.discountTiers}</Label>
          <div className="overflow-y-auto space-y-2 pr-2 -mr-2">
            {sortedTiers.map((tier) => {
              const discountPercent = basePrice && tier.pricePerUnit < basePrice ? Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100) : 0;
              return (
                <div key={tier.minQuantity} className={cn("grid grid-cols-12 items-center gap-4 p-3 bg-muted/50 rounded-lg", activeTierMinQuantity === tier.minQuantity && "border border-primary bg-primary/10")}>
                  <div className="col-span-3">{discountPercent > 0 ? <Badge variant="destructive" className='text-base'>-{discountPercent}%</Badge> : <Badge variant={'default'}>Regular</Badge>}</div>
                  <div className="col-span-5 text-center font-semibold">{numberFormatter.format(tier.minQuantity)}{tier.maxQuantity ? ` - ${numberFormatter.format(tier.maxQuantity)}` : '+'}<span className="ml-1 font-normal text-muted-foreground">{product.unit}(s)</span></div>
                  <div className="col-span-4 text-right">{discountPercent > 0 && <p className="text-xs text-muted-foreground line-through">{currencyFormatter.format(basePrice)}</p>}<p className={cn("font-bold text-lg -mt-1", activeTierMinQuantity === tier.minQuantity && "text-primary")}>{currencyFormatter.format(tier.pricePerUnit)}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t space-y-4">
        <div className="w-full flex justify-between items-center bg-muted p-4 rounded-lg"><span className="text-muted-foreground">{t.totalPrice}</span><span className="text-2xl font-bold">{currencyFormatter.format(totalPrice)}</span></div>
        {errorMessage && <p className="text-sm text-destructive text-center">{errorMessage}</p>}
        <Button type="button" size="lg" className="w-full h-12" onClick={handleConfirm} disabled={!!errorMessage || isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isOwner ? <><Ban className="mr-2 h-5 w-5" />{t.yourProduct}</> : <><ShoppingCart className="mr-2 h-5 w-5" />{t.addToCart}</>}</Button>
      </div>
    </div>
  );
};

// --- Main Modal Component ---
interface AddToCartModalProps { isOpen: boolean; onOpenChange: (open: boolean) => void; product: Product; }
export const AddToCartModal = ({ isOpen, onOpenChange, product }: AddToCartModalProps) => {
  const { user, isAuthenticated, checkLoggedInUser } = useAuth();
  const { addItemToCart } = useCart();
  const isDesktop = useIsDesktop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editableAddress, setEditableAddress] = useState(user?.address || "");
  const [editablePhone, setEditablePhone] = useState(user?.phone || "");
  const [orderQuantity, setOrderQuantity] = useState(product.minimumOrderQuantity);

  useEffect(() => { if (isOpen) { setOrderQuantity(product.minimumOrderQuantity); setEditableAddress(user?.address || ""); setEditablePhone(user?.phone || ""); setIsEditingAddress(false); } }, [isOpen, user]);
  
  const t = useMemo(() => ({ stock: 'Stock', regularPrice: 'Regular Price', shippingFrom: 'Shipping From', shippingTo: 'Shipping To', contactPhone: 'Contact Phone', orderQuantity: 'Order Quantity', discountTiers: 'Discount Tiers', totalPrice: 'Total Price', addToCart: 'Add to Cart', yourProduct: 'This is your product', edit: 'Edit', save: 'Save', cancel: 'Cancel', addressUpdated: 'Shipping info updated.', errorIsOwner: 'You cannot add your own product.', errorMinQuantity: `Minimum order quantity is {quantity}.`, errorMaxStock: `Cannot exceed available stock of {quantity}.`, }), []);
  
  const numberFormatter = useMemo(() => new Intl.NumberFormat('en-US'), []);
  const currencyFormatter = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }), []);
  const sortedTiers = useMemo(() => [...product.pricingTiers].sort((a: PricingTier, b: PricingTier) => a.minQuantity - b.minQuantity), [product.pricingTiers]);
  const basePrice = useMemo(() => (product.regularUnitPrice && product.regularUnitPrice > 0 ? product.regularUnitPrice : sortedTiers.length > 0 ? Math.max(...sortedTiers.map((t: PricingTier) => t.pricePerUnit)) : 0), [product.regularUnitPrice, sortedTiers]);
  const pricePerUnit = useMemo(() => { let p = basePrice > 0 ? basePrice : (sortedTiers[0]?.pricePerUnit || 0); for (const tier of sortedTiers) { if (orderQuantity >= tier.minQuantity) p = tier.pricePerUnit; } return p; }, [orderQuantity, sortedTiers, basePrice]);
  const activeTierMinQuantity = useMemo(() => { let min = -1; for (const tier of sortedTiers) { if (orderQuantity >= tier.minQuantity) min = tier.minQuantity; } return min; }, [orderQuantity, sortedTiers]);
  const totalPrice = orderQuantity * pricePerUnit;
  const isOwner = user?._id === product.sellerId;
  const imageUrl = product.thumbnail?.url || product.previews?.[0]?.url || '/logo/logo.png';
  const hasRealImage = !!(product.thumbnail?.url || product.previews?.[0]?.url);
  const errorMessage = useMemo(() => { if (isOwner) return t.yourProduct; if (orderQuantity < product.minimumOrderQuantity) return t.errorMinQuantity.replace('{quantity}', numberFormatter.format(product.minimumOrderQuantity)); if (orderQuantity > product.stockQuantity) return t.errorMaxStock.replace('{quantity}', numberFormatter.format(product.stockQuantity)); return null; }, [isOwner, orderQuantity, product, t, numberFormatter]);
  const handleQuantityChange = useCallback((newQuantity: number) => { if (isNaN(newQuantity)) { setOrderQuantity(product.minimumOrderQuantity); return; } setOrderQuantity(Math.max(0, Math.min(newQuantity, product.stockQuantity))); }, [product.minimumOrderQuantity, product.stockQuantity]);
  
  const handleSaveAddress = async () => {
    if (!editableAddress.trim() || !editablePhone.trim()) { toast.error("Address and phone cannot be empty."); return; }
    try {
      await apiClient.cart.updateShippingInfo({ shippingAddress: editableAddress, contactPhone: editablePhone });
      await checkLoggedInUser();
      toast.success(t.addressUpdated);
      setIsEditingAddress(false);
    } catch (error) { console.error("Failed to update shipping info:", error); }
  };

  const handleConfirm = async () => {
    if (errorMessage) { toast.error(errorMessage); return; }
    setIsSubmitting(true);
    try { await addItemToCart(product._id, orderQuantity); onOpenChange(false); } 
    catch (error) { console.error('Failed to add to cart:', error); } 
    finally { setIsSubmitting(false); }
  };
  
  if (!isOpen) return null;
  const contentProps: CartContentProps = { product, user, isAuthenticated, orderQuantity, handleQuantityChange, sortedTiers, activeTierMinQuantity, basePrice, t, numberFormatter, currencyFormatter, isEditingAddress, setIsEditingAddress, editableAddress, setEditableAddress, editablePhone, setEditablePhone, handleSaveAddress, totalPrice, errorMessage, isSubmitting, isOwner, handleConfirm };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => onOpenChange(false)}>
      <div className="relative flex flex-col w-full max-w-sm md:max-w-2xl lg:max-w-4xl max-h-[96vh] bg-background shadow-lg rounded-lg m-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground z-20"><X className="h-5 w-5" /></button>
        <div className="flex-shrink-0 p-6 border-b space-y-4">
          <div className="flex items-center gap-4"><div className={cn("relative h-16 w-16 flex-shrink-0 bg-muted rounded-md overflow-hidden", !hasRealImage && "p-2")}><Image src={imageUrl} alt={product.name} fill className={cn("object-cover", !hasRealImage && "!object-contain opacity-50")} sizes="64px" /></div><div><h2 className="text-xl font-semibold text-foreground">{product.name}</h2><Badge variant="secondary" className="mt-1">{t.stock}: {numberFormatter.format(product.stockQuantity)}</Badge></div></div>
          {product.regularUnitPrice > 0 && (
            <div className="flex justify-between items-baseline pt-4 border-t"><span className="text-muted-foreground font-medium">{t.regularPrice}</span><span className="font-bold text-xl text-foreground">{currencyFormatter.format(product.regularUnitPrice)}</span></div>
          )}
        </div>
        {isDesktop ? <CartContentDesktop {...contentProps} /> : <CartContentMobile {...contentProps} />}
      </div>
    </div>
  );
};