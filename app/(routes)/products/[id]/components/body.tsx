"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  AlertTriangle, MapPin, Package as PackageIcon, DollarSign as DollarSignIcon, ShoppingCart, UserCircle, ShieldCheck, Star, Eye, MessageSquare, Weight, Scan, Ruler, CalendarDays
} from "lucide-react";

import apiClient from "@/lib/apiClient";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { Product, Zone, ProductMedia } from "@/lib/types";
import { useLanguage } from "@/app/components/contexts/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/app/components/hooks/get-product";
import { useUser } from "@/app/components/hooks/use-user";
import { AddToCartModal } from "@/app/components/modals/cart-modal";
import { Separator } from "@/components/ui/separator";
import { ProductImageGallery } from "./ProductImageGallery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BodyProps {
  id: string;
}

// Sub-components are unchanged
const PricingTiersList = ({ tiers, unit }: { tiers: Product['pricingTiers'], unit: string }) => {
  const { language } = useLanguage();
  const formatter = new Intl.NumberFormat(language === "bn" ? "bn-BD" : "en-US", { style: "currency", currency: "BDT" });
  if (!tiers || tiers.length === 0) return <p className="text-muted-foreground">Pricing information not available.</p>;
  return <div className="space-y-2">{tiers.sort((a, b) => a.minQuantity - b.minQuantity).map((tier, index) => (<div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-card-foreground">{tier.minQuantity}{tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+'}<span className="ml-1 font-normal text-muted-foreground">{unit}(s)</span></div><div className="font-bold text-lg text-primary">{formatter.format(tier.pricePerUnit)}<span className="text-sm font-medium text-muted-foreground"> / {unit}</span></div></div>))}</div>;
};

const ZoneDisplay = ({ zoneId }: { zoneId: string }) => {
  const [zone, setZone] = useState<Zone | null>(null);
  useEffect(() => { apiClient.zones.findAll().then(res => { const foundZone = res.data.find(z => z._id === zoneId); if (foundZone) setZone(foundZone); }); }, [zoneId]);
  if (!zone) return <Skeleton className="h-5 w-24" />;
  return <span>{zone.name}</span>;
};

const ProductHeader = ({ name, brand, model }: { name: string, brand?: string, model?: string }) => {
    const subHeaderText = [brand, model].filter(Boolean).join(' - ');
    return (
        <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tighter">{name}</h1>
            {subHeaderText && (<p className="text-lg text-muted-foreground mt-2">{subHeaderText}</p>)}
        </div>
    );
};

const ProductStats = ({ rating, reviewCount, viewCount }: { rating: number, reviewCount: number, viewCount: number }) => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /><span className="font-semibold">{rating.toFixed(1)}</span></div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /><span>{reviewCount} Reviews</span></div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5"><Eye className="h-4 w-4" /><span>{viewCount} Views</span></div>
    </div>
);

const ProductInfoSections = ({ product }: { product: Product }) => (
    <div className="space-y-8">
        <Card><CardHeader><CardTitle>Product Description</CardTitle></CardHeader><CardContent><p className="text-muted-foreground leading-relaxed">{product.description}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Specifications</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Brand</span><span className="font-semibold">{product.brand}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="font-semibold">{product.model}</span></div>{product.weight && <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-2"><Weight className="h-4 w-4"/>Weight</span><span className="font-semibold">{product.weight} kg</span></div>}{product.dimensions && <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-2"><Ruler className="h-4 w-4"/>Dimensions</span><span className="font-semibold">{product.dimensions}</span></div>}{product.sku && <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-2"><Scan className="h-4 w-4"/>SKU</span><span className="font-semibold">{product.sku}</span></div>}{product.specifications && <div className="pt-4 border-t"><p className="text-muted-foreground whitespace-pre-wrap">{product.specifications}</p></div>}</CardContent></Card>
    </div>
);

const SellerInfoCard = ({ sellerId }: { sellerId: string }) => {
  const { data: seller, isLoading } = useUser(sellerId);
  const getInitials = (displayName?: string) => {
    if (!displayName) return "??";
    const parts = displayName.split(' ');
    if (parts.length > 1) { return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase(); }
    return `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
  };
  const memberSinceFormatted = seller?.memberSince ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(seller.memberSince)) : null;

  if (isLoading) { return ( <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6" /> Seller Information</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-4"><Skeleton className="h-16 w-16 rounded-full" /><div className="space-y-2"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-24" /></div></div><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card> ); }
  if (!seller) { return ( <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6" /> Seller Information</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Seller details could not be loaded.</p></CardContent><CardFooter><Button variant="outline" className="w-full" asChild><Link href={`/profile/${sellerId}`}>View Profile</Link></Button></CardFooter></Card> ); }

  return ( <Card className="h-fit"><CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6" /> Seller Information</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-4"><Avatar className="h-16 w-16 border"><AvatarImage src={seller.profilePicture ?? undefined} alt={seller.displayName} /><AvatarFallback>{getInitials(seller.displayName)}</AvatarFallback></Avatar><div><p className="text-lg font-bold">{seller.displayName}</p>{seller.contactName && <p className="text-sm text-muted-foreground">{seller.contactName}</p>}</div></div>{seller.isTrustedUser && (<Badge variant="secondary" className="w-full justify-center py-2 text-base font-semibold border-green-500 text-green-600"><ShieldCheck className="h-5 w-5 mr-2" /> Trusted Seller</Badge>)}{memberSinceFormatted && (<div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t"><CalendarDays className="h-4 w-4" /> Member since {memberSinceFormatted}</div>)}</CardContent><CardFooter><Button variant="outline" className="w-full" asChild><Link href={`/profile/${seller._id}`}>View Profile</Link></Button></CardFooter></Card> );
};

const ProductDetails = ({ product, allMedia, isMediaLoading, onAddToCartClick }: { product: Product, allMedia: ProductMedia[], isMediaLoading: boolean, onAddToCartClick: () => void }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 space-y-8 lg:space-y-0">
        <div className="lg:col-span-7 space-y-8">
            {isMediaLoading ? 
              <Skeleton className="aspect-square w-full" /> :
              <ProductImageGallery allMedia={allMedia} productName={product.name} />
            }
            <ProductInfoSections product={product} />
        </div>
        <div className="lg:col-span-5 lg:sticky top-24 h-fit space-y-6">
            <ProductHeader name={product.name} brand={product.brand} model={product.model} />
            <ProductStats rating={product.rating || 0} reviewCount={product.reviewCount || 0} viewCount={product.viewCount || 0} />
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><DollarSignIcon className="h-6 w-6" /> Pricing</CardTitle><CardDescription>Minimum order: {product.minimumOrderQuantity} {product.unit}(s)</CardDescription></CardHeader><CardContent><PricingTiersList tiers={product.pricingTiers} unit={product.unit} /></CardContent></Card>
            <Card><CardContent className="pt-6 space-y-4"><div className="flex justify-between items-center"><div className="flex items-center gap-3 text-sm font-medium text-muted-foreground"><PackageIcon className="h-5 w-5" /> In Stock:</div><Badge variant={product.stockQuantity > 0 ? "default" : "destructive"}>{product.stockQuantity} {product.unit}(s)</Badge></div><div className="flex justify-between items-center"><div className="flex items-center gap-3 text-sm font-medium text-muted-foreground"><MapPin className="h-5 w-5" /> Shipping From:</div><span className="font-semibold"><ZoneDisplay zoneId={product.zoneId} /></span></div><Button size="lg" className="w-full text-lg mt-4 h-12" onClick={onAddToCartClick}><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</Button></CardContent></Card>
            <SellerInfoCard sellerId={product.sellerId} />
        </div>
    </div>
  );
};

export default function ProductBody({ id }: BodyProps) {
  const { data: product, isLoading: isProductLoading, error: productError } = useProduct(id);
  const [allMedia, setAllMedia] = useState<ProductMedia[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- THIS IS THE SIMPLIFIED MEDIA PROCESSING LOGIC ---
  useEffect(() => {
    // Don't run if the main product data isn't loaded yet
    if (!product) {
      if (!isProductLoading) setIsMediaLoading(false);
      return;
    }

    const processMedia = async () => {
      setIsMediaLoading(true);
      let media: ProductMedia[] = [];

      // Priority 1: Use the new thumbnail/previews fields if they exist
      if (product.thumbnail) media.push(product.thumbnail);
      if (product.previews) media.push(...product.previews);
      
      // Priority 2: If still no images, use the fallback API endpoint
      if (media.length === 0) {
        try {
          console.log(`Product ${product._id} has no embedded media. Fetching from fallback endpoint...`);
          const response = await apiClient.uploads.getMediaForEntity('Product', product._id);
          if (response.data.images && response.data.images.length > 0) {
            // Transform the fallback data into the format the gallery component needs
            media = response.data.images.map((img, index) => ({
              _id: img._id,
              url: img.url,
              purpose: index === 0 ? 'thumbnail' : 'preview', // Assume first is thumbnail
              priority: index,
            }));
          }
        } catch (err) {
          console.error(`Failed to fetch fallback media for product ${product._id}:`, err);
        }
      }
      
      setAllMedia(media.sort((a, b) => a.priority - b.priority)); // Ensure sorted
      setIsMediaLoading(false);
    };

    processMedia();
  }, [product, isProductLoading]);
  // --- END OF NEW LOGIC ---

  const isLoading = !isMounted || isProductLoading;
  const error = productError;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7 space-y-8"><Skeleton className="aspect-square w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>
            <div className="lg:col-span-5 space-y-6"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-5 w-full" /><Skeleton className="h-40 w-full" /><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>
        </div>
      );
    }

    if (error || !product) {
      const errorMessage = error instanceof AxiosError ? error.response?.data?.message : "The product you're looking for doesn't exist or has been removed.";
      return <Card className="border-destructive max-w-lg mx-auto"><CardHeader className="text-center"><CardTitle className="flex items-center justify-center gap-3 text-destructive"><AlertTriangle size={48} />Product Not Found</CardTitle><CardDescription>{errorMessage}</CardDescription></CardHeader><CardContent className="flex justify-center gap-3 mt-4"><Button variant="outline" onClick={() => window.history.back()}>Go Back</Button><Button asChild><Link href="/products">See All Products</Link></Button></CardContent></Card>;
    }

    return (
        <>
            <ProductDetails product={product} allMedia={allMedia} isMediaLoading={isMediaLoading} onAddToCartClick={() => setIsModalOpen(true)} />
            <AddToCartModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} product={product} />
        </>
    );
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={null} sidebar={null}>
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">{renderContent()}</div>
    </BasicPageProvider>
  );
}