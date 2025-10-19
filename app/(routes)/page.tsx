import { Metadata } from "next";
import HomeClient from "./home/body";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const title = "Wholesale BD - Fastest Growing E-commerce for Startups & Small Businesses";
  const description =
    "Explore Wholesale BD, the fastest-growing platform offering top deals, products, and features tailored for startups and small businesses.";
  const imageUrl = `${baseUrl}/logo/logo.png`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,

    openGraph: {
      title,
      description,
      url: new URL("/", baseUrl),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Wholesale BD Logo",
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      site: "@WholesaleBD", // Replace with your Twitter handle
      creator: "@WholesaleBD",
    },

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en",
        "bn-BD": "/bn",
      },
    },
  };
}

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // JSON-LD structured data for Organization and WebSite
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Wholesale BD",
        "url": baseUrl,
        "logo": `${baseUrl}/logo/logo.png`,
        "sameAs": [
          "https://www.facebook.com/WholesaleBD",   // Update with your real URLs
          "https://twitter.com/WholesaleBD",
          "https://www.linkedin.com/company/wholesalebd"
        ]
      },
      {
        "@type": "WebSite",
        "url": baseUrl,
        "name": "Wholesale BD - Fastest Growing E-commerce for Startups & Small Businesses",
        "description":
          "Explore Wholesale BD, the fastest-growing platform offering top deals, products, and features tailored for startups and small businesses.",
        "publisher": {
          "@type": "Organization",
          "name": "Wholesale BD",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo/logo.png`,
          }
        }
      }
    ],
  };

  return (
    <>
      <HomeClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
