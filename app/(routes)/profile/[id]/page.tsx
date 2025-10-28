// app/(routes)/profile/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Body from "./body";
import { PublicUserProfile, Product } from "@/lib/types";

// Define the shape of the props for this page component
// FIX: The params object can be a Promise, so we adjust the type to match.
interface PublicProfilePageProps {
  params: Promise<{ id: string }>;
}

// Server-Side Data Fetching Function (This function is correct, no changes needed)
async function getUserData(id: string): Promise<{ user: PublicUserProfile, products: Product[] } | null> {
    try {
        const [userRes, productsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/public/seller/${id}`)
        ]);
        
        if (!userRes.ok) {
            // If the user is not found, we can exit early
            return null;
        }

        const user: PublicUserProfile = await userRes.json();
        // If products fail to fetch, we can still show the profile with an empty product list
        const products: Product[] = productsRes.ok ? await productsRes.json() : [];

        return { user, products };

    } catch (error) {
        console.error("Failed to fetch user data for SSR:", error);
        return null;
    }
}

// Dynamic Metadata for SEO & Link Previews
export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
    // FIX: Await the params object before destructuring from it.
    const { id } = await params;
    const data = await getUserData(id);

    if (!data) {
        return {
            title: "Profile Not Found | Wholesale BD",
        };
    }

    const { user } = data;
    const title = user.displayName;
    const description = `View the public profile and products from ${title} on Wholesale BD.`;
    const imageUrl = user.profilePicture || '/logo/logo.png';

    return {
        title: `${title} | Wholesale BD`,
        description,
        openGraph: {
            title,
            description,
            images: [imageUrl],
        },
    };
}


// The Main Page Component (Server Component)
export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
    // FIX: Await the params object before destructuring from it.
    const { id } = await params;
    const data = await getUserData(id);

    if (!data) {
        notFound(); // This will render the not-found.tsx file
    }

    // Pass the fetched data as props to the client component Body
    return <Body user={data.user} products={data.products} />;
}