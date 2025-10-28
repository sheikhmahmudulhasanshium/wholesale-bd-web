// app/(routes)/products/[id]/page.tsx

import { Metadata } from "next";
import ProductBody from "./components/body";
import { Product } from "@/lib/types"; // <-- IMPORT THE UPDATED PRODUCT TYPE

interface PageProps { 
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let product: Product | null = null; // <-- USE THE CORRECT TYPE
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/public/find/${id}`;
  
  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (response.ok) {
        product = await response.json();
    }
  } catch (error) {
    console.error(`[Metadata Fetch] A critical error occurred:`, error);
  }

  const baseTitle = "Products | Wholesale BD";
  const title = product?.name ? `${product.name} | ${baseTitle}` : baseTitle;
  const description = product?.description || "Detailed information for this specific product.";
  
  // --- VVVVVVV NEW BACKWARD-COMPATIBLE LOGIC VVVVVVV ---
  const imageUrl = product?.thumbnail?.url || product?.images?.[0] || `${baseUrl}/logo/logo.png`; 
  // --- ^^^^^^^ NEW BACKWARD-COMPATIBLE LOGIC ^^^^^^^ ---

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: new URL(`/products/${id}`, baseUrl),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article", 
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params; 
  
  return <ProductBody id={id} />; 
}