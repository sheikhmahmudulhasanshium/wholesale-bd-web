// @/app/(routes)/orders/page.tsx


// app/(routes)/orders/page.tsx

import { Metadata } from 'next';
import { Body } from './body';

export async function generateMetadata(): Promise<Metadata> {
  const title = "My Orders - Wholesale BD";
  const description = "View and manage your order history.";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

// This Server Component renders the Client Component
export default function OrdersPage() {
  return <Body />;
}