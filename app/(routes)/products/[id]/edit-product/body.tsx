// app/(routes)/products/[id]/edit-product/body.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Core Components
import { EditProductForm } from '@/app/components/forms/edit-product-form';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import { Header } from '@/app/components/common/header';
import Footer from '@/app/components/common/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle } from 'lucide-react'; // <-- IMPORT PlusCircle

interface EditClientPageProps {
  initialData: Product;
}

export default function EditClientPage({ initialData }: EditClientPageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">
              You are editing: <span className="font-semibold text-foreground">{initialData.name}</span>
            </p>
          </div>
          
          {!isMounted ? (
            <div className="space-y-8">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-56 w-full rounded-lg" />
            </div>
          ) : (
            <EditProductForm initialData={initialData} />
          )}

          {/* --- THIS SECTION IS IMPROVED --- */}
          <div className='flex items-center w-full justify-between mt-8 pt-6 border-t'>
            {/* "Go Back" button uses router.back() and an outline style for less emphasis */}
            <Button variant="outline" size={'lg'} onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-5 w-5"/>
                <span>Go Back</span>
            </Button>

            {/* "Add New Product" button now correctly links to the create page */}
            <Button asChild size={'lg'}>
                <Link href="/products/add-product">
                    <PlusCircle className="mr-2 h-5 w-5"/>
                    <span>Add New Product</span>
                </Link>
            </Button>
          </div>
          {/* --- END OF IMPROVEMENT --- */}
          
        </div>
      </main>
    </BasicPageProvider>
  );
}