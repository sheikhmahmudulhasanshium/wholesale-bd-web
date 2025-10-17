// app/(routes)/products/page.tsx
"use client"; // Needs to be a client component to use BasicPageProvider and hooks

import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { NavMenu } from "@/app/components/common/navbar";
import Sidebar from "@/app/components/common/sidebar";

// Note: A real implementation would fetch products using useProducts hook and render a grid.
const ProductsClient = () => {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={<NavMenu/>} sidebar={<Sidebar/>}>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        
        <div className="min-h-[400px] flex items-center justify-center border border-dashed p-10 rounded-lg bg-secondary/30">
          <p className="text-muted-foreground">Product listing content will be displayed here soon.</p>
        </div>
      </div>
    </BasicPageProvider>
  );
}

export default ProductsClient;