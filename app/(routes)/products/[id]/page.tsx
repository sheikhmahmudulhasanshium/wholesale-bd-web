// app/(routes)/products/[id]/page.tsx

import { Metadata } from "next";
import ProductBody from "./components/body";

interface PageProps { 
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let product: { name?: string; description?: string; images?: string[] } | null = null;
  
  // --- vvvvvvv THIS IS THE UPDATED FETCH BLOCK vvvvvvv ---
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/public/find/${id}`;
  
  // Log the URL to the terminal where your Next.js server is running
  console.log(`[Metadata Fetch] Attempting to fetch: ${apiUrl}`);

  try {
    // FIX: Added { cache: 'no-store' } to bypass server-side caching
    const response = await fetch(apiUrl, { cache: 'no-store' });

    // Log the response status to see if it's a 404, 500, etc.
    console.log(`[Metadata Fetch] Response Status: ${response.status}`);
    
    if (response.ok) {
        product = await response.json();
        console.log(`[Metadata Fetch] Success! Product Name: ${product?.name}`);
    } else {
        // Log an error if the response was not successful
        console.log(`[Metadata Fetch] Failed to fetch. Status: ${response.status}`);
    }
  } catch (error) {
    console.log(`[Metadata Fetch] A critical error occurred:`, error);
  }
  // --- ^^^^^^^ THIS IS THE UPDATED FETCH BLOCK ^^^^^^^ ---

  const baseTitle = "Products | Wholesale BD";
  const title = product?.name ? `${product.name} | ${baseTitle}` : baseTitle;
  const description = product?.description || "Detailed information for this specific product.";
  
  const imageUrl = product?.images?.[0] || `${baseUrl}/logo/logo.png`; 

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