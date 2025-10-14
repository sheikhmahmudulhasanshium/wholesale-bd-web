import { Metadata } from 'next';
import DashboardClientPage from './body';

// Metadata generation MUST stay in the server component (page.tsx)
export async function generateMetadata(): Promise<Metadata> {
  const title = "Dashboard - Wholesale BD";
  const description = "Welcome to your dashboard. Manage your account and products.";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

// This Server Component now just renders the Client Component
export default function DashboardPage() {
  return <DashboardClientPage />;
}