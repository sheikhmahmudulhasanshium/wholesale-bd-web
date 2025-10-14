import { Metadata } from 'next';
import EditProductClientPage from './body'; // We will create this client component next

export async function generateMetadata(): Promise<Metadata> {
  // You could dynamically fetch product name for the title here if needed
  const title = "Edit Product - Wholesale BD";
  const description = "Edit product details on your dashboard.";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

// This Server Component just renders the Client Component
export default function EditProductPage() {
  return <EditProductClientPage />;
}