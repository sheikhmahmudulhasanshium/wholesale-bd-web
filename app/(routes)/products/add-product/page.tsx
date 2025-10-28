// app/(routes)/products/add-product/page.tsx

"use client";

import { useAuth } from "@/app/components/contexts/auth-context";
import { CreateProductForm } from "@/app/components/forms/create-product-form";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Metadata } from 'next';

// Note: generateMetadata can't be used in a "use client" file.
// We should export metadata from a server component wrapper if needed.
// For simplicity, we keep this as a client component.

export default function AddProductPage() {
  const { user, isLoading } = useAuth();

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-[500px] rounded-lg" />;
    }

    if (user?.role !== 'seller') {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-4 p-8 border rounded-lg bg-card">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground max-w-md">
                Only approved sellers can add new products. If you are a seller, please wait for your account to be approved.
            </p>
            <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
        </div>
      );
    }
    
    return <CreateProductForm />;
  };

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Add a New Product</h1>
            <p className="text-muted-foreground">Fill in the details below to list your product on the marketplace.</p>
        </div>
        {renderContent()}
      </div>
    </BasicPageProvider>
  );
}