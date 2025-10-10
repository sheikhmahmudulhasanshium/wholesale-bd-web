// app/dashboard/page.tsx
import Footer from '@/app/components/common/footer';
import { Header } from '@/app/components/common/header';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import { Metadata } from 'next';

// 1. DYNAMIC METADATA GENERATION (runs on the server)
export async function generateMetadata(): Promise<Metadata> {
  // You can fetch data here if needed: const product = await fetch(...)
  
  const title = "Dashboard - Wholesale BD";
  const description = "Welcome to the admin dashboard. Please check the features below.";
  const imageUrl = "https://www.your-domain.com/images/dashboard-preview.png"; // A specific image for this page

  return {
    title: title,
    description: description,
    
    // Open Graph (for link previews on social media)
    openGraph: {
      title: title,
      description: description,
      url: 'https://www.your-domain.com/dashboard', // The canonical URL for this page
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Dashboard Preview',
        },
      ],
      type: 'website',
    },
    
    // Twitter Card (for link previews on Twitter)
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

// 2. THE PAGE COMPONENT (also a Server Component)
export default function DashboardPage() {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      {/* Page-specific content goes here */}
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-4">This is your main dashboard content.</p>
        {/* ...more components */}
      </div>
    </BasicPageProvider>
  );
}