// app/(routes)/support/page.tsx

import { Metadata } from 'next';
import Body from './body';

export async function generateMetadata(): Promise<Metadata> {
  const title = "Support - Wholesale BD";
  const description = "Get help with your account, orders, or any other inquiries.";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function SupportPage() {
  return <Body />;
}