import { Metadata } from "next";
import { notFound } from "next/navigation";
import Body from "./body";
import { PublicUserProfile, Product } from "@/lib/types";
import apiClient from "@/lib/apiClient";

interface PublicProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getUserData(id: string): Promise<{ user: PublicUserProfile, products: Product[] } | null> {
    try {
        const [userResponse, productsResponse] = await Promise.all([
            apiClient.users.getPublicProfileById(id),
            apiClient.products.getBySellerIdPublic(id)
        ]);
        
        const user = userResponse.data;
        const products = productsResponse.data;

        return { user, products };

    } catch (error) {
        console.error(`[Profile Page] Failed to fetch data for user ID ${id}:`, error);
        return null;
    }
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
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

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
    const { id } = await params;
    const data = await getUserData(id);

    if (!data) {
        notFound();
    }

    return <Body user={data.user} products={data.products} />;
}