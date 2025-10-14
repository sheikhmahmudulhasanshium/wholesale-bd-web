// FILE: @/app/(routes)/products/product-card.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreVertical, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Product } from "@/lib/types";
import { useAuth } from "@/app/components/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/app/components/hooks/delete-product";

interface ProductCardProps {
  product: Product;
}

// --- The Main Product Card Component ---
export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { deleteProduct } = useDeleteProduct();

  // ✅ --- START OF FIX: LOGIC TO IDENTIFY PROBLEMATIC PRODUCTS ---
  const primaryImageIdentifier = product.images?.[0];

  // A product is "problematic" if it has an image entry that is NOT a full http/https URL.
  const isProblematic = primaryImageIdentifier && !primaryImageIdentifier.startsWith('http');
  
  // The image URL is only considered valid if it's not problematic.
  const primaryImageUrl = !isProblematic ? (primaryImageIdentifier || "/imgnotfound.svg") : "/imgnotfound.svg";
  // ✅ --- END OF FIX ---

  const startingPrice = product.pricingTiers?.length > 0
    ? Math.min(...product.pricingTiers.map(tier => tier.pricePerUnit))
    : 0;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(startingPrice);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This is a soft delete.`)) {
      try {
        await deleteProduct(product._id);
        toast.success("Product deleted successfully.");
        router.refresh(); 
      } catch {
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleUpdate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Assuming your edit page is at /dashboard/products/edit/[id]
    router.push(`/dashboard/edit-product/?id=${product._id}`);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col group transition-all hover:shadow-lg relative">
      {/* Admin Menu */}
      {user?.role === 'admin' && (
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleUpdate}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Update</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <Link href={`/products/${product._id}`} className="flex flex-col h-full">
        {/* ✅ --- START OF FIX: CONDITIONAL IMAGE RENDERING --- */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {/* If the product is problematic AND the user is an admin, show a red block. */}
          {isProblematic && user?.role === 'admin' ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-red-500/20 text-red-700 p-4">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="text-center text-xs font-semibold">Invalid Image Source</p>
            </div>
          ) : (
            // Otherwise, render the image as normal (or the fallback).
            <Image
              src={primaryImageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        {/* ✅ --- END OF FIX --- */}
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg leading-snug truncate group-hover:text-primary">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            by {product.sellerId?.businessName || "Verified Seller"}
          </p>
          
          <div className="mt-4 flex-grow">
            <p className="text-sm text-muted-foreground">Starts from</p>
            <p className="text-2xl font-bold">
              BDT {formattedPrice}
              <span className="text-base font-normal text-muted-foreground"> / {product.unit}</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 items-center justify-between">
           <Badge variant="secondary">MOQ: {product.minimumOrderQuantity} {product.unit}s</Badge>
           <div className="flex items-center gap-1 text-xs text-muted-foreground">
             <MapPin className="h-3 w-3" />
             {product.zoneId?.name || "Global"}
           </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

// --- The Skeleton Component for Loading States ---
  // ... (This component remains unchanged)

// --- The Skeleton Component for Loading States ---
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Skeleton className="relative aspect-[4/3] w-full" />
      <CardContent className="p-4 flex-grow flex flex-col">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
        <div className="mt-4 flex-grow space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-1/2" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </CardFooter>
    </Card>
  );
}