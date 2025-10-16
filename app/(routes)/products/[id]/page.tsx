import { Metadata } from 'next';
import Body from './components/body'; // Client-side component

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
}

// SSR: Generate dynamic metadata (Open Graph, SEO) for each page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params; // No need to await params here since it's already resolved by Next.js
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Fetch product data for metadata
  const res = await fetch(`https://wholesale-bd-production.up.railway.app/products/${id}`, {
    headers: { accept: '*/*' },
    cache: 'force-cache',
  });

  if (!res.ok) {
    return {
      title: 'Product not found',
      description: 'The requested product does not exist.',
      openGraph: {
        title: 'Product not found',
        description: 'No product data available',
        images: [],
      },
    };
  }

  const product = await res.json(); // Parse the product data

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((url: string) => ({ url })),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@your_site',
      title: product.name,
      description: product.description,
      images: product.images[0] || `${baseURL}/logo/logo.png`, // Use the first image for Twitter card
    },
  };
}

// SSR Page Rendering for Dynamic Routes
export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params; // params is directly accessible in SSR

  return <Body id={id} />; // Pass the `id` directly to the Body component for client-side rendering
}
