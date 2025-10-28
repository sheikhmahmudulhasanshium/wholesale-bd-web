// app/(routes)/products/[id]/edit-product/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Product } from '@/lib/types';
import EditProductClientPage from './body';
import apiClient from '@/lib/apiClient'; // <-- 1. IMPORT apiClient

// 2. UPDATE THE PROPS INTERFACE
interface EditPageProps {
  params: Promise<{ id: string }>;
}

// 3. UPDATE THE DATA FETCHING FUNCTION TO USE apiClient
async function getProductForEdit(id: string): Promise<Product | null> {
  try {
    // We now use our centralized, type-safe apiClient method.
    // This also ensures the product shape is transformed correctly.
    const response = await apiClient.products.getByIdPublic(id);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id} for editing:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  // 4. AWAIT the params object
  const { id } = await params;
  const product = await getProductForEdit(id);
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
  // 5. AWAIT the params object
  const { id } = await params;
  const product = await getProductForEdit(id);

  if (!product) {
    notFound(); // Triggers the 404 page if product doesn't exist
  }

  // Render the client component, passing the fetched product as a prop
  return <EditProductClientPage initialData={product} />;
}