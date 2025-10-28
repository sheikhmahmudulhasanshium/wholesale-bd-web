// app/(routes)/products/[id]/edit-product/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Product } from '@/lib/types';
import EditProductClientPage from './body';

interface EditPageProps {
  params: { id: string };
}

// Server-side data fetching for the edit page
async function getProductForEdit(id: string): Promise<Product | null> {
  try {
    // Use the public endpoint, as the original hook did. 
    // Protected data should be handled by the form submission logic.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/public/find/${id}`, {
      cache: 'no-store', // Ensure we get the latest data for editing
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id} for editing:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const product = await getProductForEdit(params.id);
  const title = product ? `Edit: ${product.name}` : 'Edit Product';

  return {
    title: `${title} | Wholesale BD`,
    robots: {
      index: false, // Prevent search engines from indexing edit pages
      follow: false,
    },
  };
}

// This is a Server Component
export default async function EditProductPage({ params }: EditPageProps) {
  const product = await getProductForEdit(params.id);

  if (!product) {
    notFound(); // Triggers the 404 page if product doesn't exist
  }

  // Render the client component, passing the fetched product as a prop
  return <EditProductClientPage initialData={product} />;
}