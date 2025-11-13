// app/register/seller/page.tsx

import { Metadata } from "next";
import Body from "./body"; // Renders the Client Component

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const title = "Wholesale BD - Become a Seller";
  const description =
    "Register as a seller on Wholesale BD to start selling your products on our B2B platform.";
  const imageUrl = `${baseUrl}/logo/logo.png`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: new URL("/register/seller", baseUrl),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Wholesale BD Seller Registration",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// This Server Component renders the Client Component that handles user interaction.
export default function SellerRegisterPage() {
  return <Body />;
}