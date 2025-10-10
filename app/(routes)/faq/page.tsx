import { Metadata } from "next";
import Body from "./body";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const title = "Wholesale BD";
  const description =
    "Welcome to our website. Explore our features and switch languages easily! Learn more about us.";
  const imageUrl = `${baseUrl}/logo/logo.png`; // Use absolute URL for robustness

  return {
    // This is the main fix for the warning.
    // It tells Next.js the root URL of your application.
    metadataBase: new URL(baseUrl),

    title,
    description,
    openGraph: {
      title,
      description,
      // The URL of the page itself
      url: new URL("/about", baseUrl),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "About Preview",
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

export default  function FAQPage  ()  {

    return ( 
        <Body/>
     );
}
 
