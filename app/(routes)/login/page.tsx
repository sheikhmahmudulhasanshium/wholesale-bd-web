// app/login/page.tsx

import { Metadata } from "next";
import Body from "./body"; // Renders the Client Component

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const title = "Wholesale BD - Login";
  const description = "Sign in to your Wholesale BD account to continue.";
  const imageUrl = `${baseUrl}/logo/logo.png`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: new URL("/login", baseUrl),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Wholesale BD Login",
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
export default function LoginPage() {
  return <Body />;
}