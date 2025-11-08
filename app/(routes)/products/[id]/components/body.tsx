// @/app/(routes)/products/[id]/body.tsx

"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import apiClient from '@/lib/apiClient';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import { Header } from '@/app/components/common/header';
import Footer from '@/app/components/common/footer';
import { ProductMedia } from '@/lib/types';
import { useProduct } from '@/app/components/hooks/get-product';
import { useAuth } from '@/app/components/contexts/auth-context';
import { AddToCartModal } from '@/app/components/modals/cart-modal';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductHeader } from './ProductHeader';
import { ProductStats } from './ProductStats';
import { PricingCard } from './PricingCard';
import { PurchaseCard } from './PurchaseCard';
import { SellerInfoCard } from './SellerInfoCard';
import { ProductInfoSections } from './ProductInfoSections';
import { ProductNotFoundError } from './ProductNotFoundError';
import { ProductPageSkeleton } from './ProductPageSkeleton';
import Navbar from './navbar';
import Sidebar from './sidebar';

interface BodyProps {
  id: string;
}

export default function ProductBody({ id }: BodyProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: product, isLoading: isProductLoading, error: productError } = useProduct(id);
  const [allMedia, setAllMedia] = useState<ProductMedia[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (id) {
      try {
        const viewedProductsJSON = sessionStorage.getItem('viewedProducts') || '[]';
        const viewedProducts: string[] = JSON.parse(viewedProductsJSON);
        if (!viewedProducts.includes(id)) {
          apiClient.products.incrementView(id).catch((err) => {
            console.error(`Failed to increment view count for product ${id}`, err);
          });
          viewedProducts.push(id);
          sessionStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
        }
      } catch (error) {
        console.error('Could not process sessionStorage for view count:', error);
      }
    }
  }, [id]);

  useEffect(() => {
    if (isMounted && isAuthenticated && window.location.hash === '#add-to-cart') {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 100);

      router.replace(`/products/${id}`);

      return () => clearTimeout(timer);
    }
  }, [isMounted, isAuthenticated, id, router]);

  const isOwner = useMemo(() => {
    return !!(user && product && user._id === product.sellerId);
  }, [user, product]);

  const handleAddToCartClick = () => {
    if (isAuthenticated) {
      if (isOwner) {
        toast.error('You cannot add your own product to the cart.');
        return;
      }
      setIsModalOpen(true);
    } else {
      toast.info('Please log in to add items to your cart.');
      const callbackUrl = encodeURIComponent(`/products/${id}#add-to-cart`);
      router.push(`/login?callbackUrl=${callbackUrl}`);
    }
  };

  useEffect(() => {
    if (!product) return;
    const processMedia = async () => {
      setIsMediaLoading(true);
      // --- THIS IS THE FIX ---
      // Changed `let media` to `const media` because it is never reassigned.
      // This resolves the `prefer-const` ESLint error that was breaking the build.
      const media: ProductMedia[] = [];
      if (product.thumbnail) media.push(product.thumbnail);
      if (product.previews) media.push(...product.previews);
      setAllMedia(media.sort((a, b) => a.priority - b.priority));
      setIsMediaLoading(false);
    };
    processMedia();
  }, [product]);

  const isLoading = !isMounted || isProductLoading;
  
  const renderContent = () => {
    if (isLoading) {
      return <ProductPageSkeleton />;
    }

    if (productError || !product) {
      return <ProductNotFoundError error={productError as AxiosError | null} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 space-y-8 lg:space-y-0">
          <div className="lg:col-span-7 space-y-8">
            <ProductImageGallery allMedia={allMedia} productName={product.name} />
            <ProductInfoSections product={product} />
          </div>
          <div className="lg:col-span-5 lg:sticky top-24 h-fit space-y-6">
            <ProductHeader name={product.name} brand={product.brand} model={product.model} />
            <ProductStats rating={product.rating || 0} reviewCount={product.reviewCount || 0} viewCount={product.viewCount || 0} />
            <PricingCard product={product} />
            <PurchaseCard product={product} onAddToCartClick={handleAddToCartClick} isOwner={isOwner} />
            <SellerInfoCard sellerId={product.sellerId} />
          </div>
        </div>
        <AddToCartModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} product={product} />
      </>
    );
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={<Navbar />} sidebar={<Sidebar productId={id}/>}>
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {renderContent()}
      </div>
    </BasicPageProvider>
  );
}