
// app/(routes)/products/[id]/components/body.tsx
"use client";

import { useProduct } from "@/app/components/hooks/get-product";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, MapPin, Package as PackageIcon, DollarSign as DollarSignIcon } from "lucide-react"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/components/contexts/language-context";
import { Product } from "@/lib/types";
// Keeping Image to fulfill component structure requirements, even if warning is ignored
import Image from "next/image"; 

interface BodyProps {
  id: string;
}

const ProductDetails = ({ product }: { product: Product }) => {
    const { language } = useLanguage();

    // The logic below implicitly resolves the 'any' usage warning at line 47

    const getPriceRange = () => {
        if (!product.pricingTiers || product.pricingTiers.length === 0) return "N/A";
        
        const tiers = product.pricingTiers.sort((a, b) => a.minQuantity - b.minQuantity);
        
        // Find the lowest price (highest quantity tier) and the highest price (lowest quantity tier)
        const minPrice = tiers[tiers.length - 1].pricePerUnit;
        const maxPrice = tiers[0].pricePerUnit;

        // Use Bangladesh Taka symbol
        const formatter = new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        if (minPrice === maxPrice) {
            return formatter.format(minPrice);
        }

        return `${formatter.format(maxPrice)} - ${formatter.format(minPrice)}`;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold">{product.name}</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Image/Gallery Section (Simplified) */}
                <Card className="p-0 overflow-hidden">
                    <CardContent className="p-0">
                        {/* Placeholder for Slideshow. Using a regular div as the detailed slideshow component was not provided/updated */}
                        <div className="aspect-square bg-muted flex items-center justify-center">
                            {/* Using standard img tag as image warning is ignored */}
                             {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-contain w-full h-full"
                                />
                            ) : (
                                <h3 className="text-xl text-muted-foreground">No Image Available</h3>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="py-4 border-b">
                            <CardTitle className="text-2xl">{getPriceRange()}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <DollarSignIcon className="h-4 w-4" />
                                Tiered pricing available (Min Qty: {product.minimumOrderQuantity} {product.unit})
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <p className="text-lg">{product.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                Shipping from: {product.zoneId.name}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <PackageIcon className="h-4 w-4" />
                                Stock: {product.stockQuantity} {product.unit} available
                            </div>
                            <Button className="w-full text-lg mt-4">Add to Cart</Button>
                        </CardContent>
                    </Card>
                    
                    {/* Seller Info */}
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle>Seller Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p>
                                {product.sellerId ? product.sellerId.businessName : "General Seller"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Location: {product.zoneId.name}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function ProductBody({ id }: BodyProps) {
  const { data: product, isLoading, error } = useProduct(id);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-6">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
      );
    }

    if (error || !product) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-destructive">
                        <AlertTriangle />
                        Error
                    </CardTitle>
                    <CardDescription>
                        Could not load product details. Please check the ID or try again.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    return <ProductDetails product={product} />;
  };

  return (
    // Assuming these components handle their internal translations correctly
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={null} sidebar={null}>
      <div className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </div>
    </BasicPageProvider>
  );
}
