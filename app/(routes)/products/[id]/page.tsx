// app/(routes)/products/[id]/page.tsx

import { Metadata } from "next";
import ProductBody from "./components/body";

interface PageProps { 
  // params is now treated as a Promise in Server Components/Metadata functions
  params: Promise<{ id: string }>;
}

// SSR: Generate dynamic metadata (Open Graph, SEO) for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // FIX: Await params before accessing its properties
  const { id } = await params;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let product: { name?: string; description?: string; images?: string[] } | null = null;
  
  // NOTE: Using direct fetch here as api.client relies on global execution context
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/${id}`);
    if (response.ok) {
        product = await response.json();
    }
  } catch (error) {
    console.error(`Error fetching product ${id} for metadata:`, error);
  }

  const defaultTitle = `Product ID: ${id} | Wholesale BD`;
  const defaultDescription = "Detailed information for this specific product.";

  const title = product?.name || defaultTitle;
  const description = product?.description || defaultDescription;
  
  // Use the first image URL or a default fallback
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
      // FIX: Changed "product" to "article" to satisfy Next.js Metadata types
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
// SSR Page Rendering for Dynamic Routes
export default async function ProductPage({ params }: PageProps) {
  // FIX: Await params before accessing properties
  const { id } = await params; 
  
  return <ProductBody id={id} />; 
}
