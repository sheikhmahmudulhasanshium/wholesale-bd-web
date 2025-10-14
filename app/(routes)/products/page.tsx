// FILE: @/app/(routes)/products/page.tsx

"use client";

import { useState } from "react";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { useProducts } from "@/app/components/hooks/use-products";
import { ProductQuery } from "@/lib/types";

export default function ProductsPage() {
  // ✅ FIXED: Removed unused `setFilters` variable.
  const [filters] = useState<ProductQuery>({
    status: 'active',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
  });

  const { data, isLoading, error } = useProducts(filters);

  const renderContent = () => {
    if (isLoading) {
      return (
        Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center text-red-500 text-lg py-10">
          <p>Could not load products.</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      );
    }

    if (!data || data.products.length === 0) {
      return (
        <div className="col-span-full text-center text-muted-foreground text-lg py-10">
          <p>No products found.</p>
        </div>
      );
    }

    return (
      data.products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))
    );
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">All Products</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderContent()}
        </div>
      </div>
    </BasicPageProvider>
  );
}