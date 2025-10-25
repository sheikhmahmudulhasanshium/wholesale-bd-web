// app/sitemap.ts

import { MetadataRoute } from 'next';
import axios from 'axios';

// --- Update the Product type to include _id ---
type Product = {
  _id: string; // We need the ID to build the URL
  name: string;
  updatedAt: string;
};

// Use environment variables for the URL.
const baseUrl = process.env.VERCEL_URL
  ? `https://` + process.env.VERCEL_URL
  : 'http://localhost:3000';

// This is our lean, server-safe fetcher function.
async function fetchAllPublicProducts(): Promise<Product[]> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/public/all`;
    console.log(`Sitemap: Fetching products from ${apiUrl}`);

    const response = await axios.get<Product[]>(apiUrl);
    const products = response.data;

    if (Array.isArray(products)) {
      console.log(`Sitemap: Successfully fetched ${products.length} products.`);
      return products;
    } else {
      console.error("Sitemap Error: API response was not a valid array.");
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error(`Sitemap Error: Failed to fetch products. Status: ${error.response?.status}, Message: ${error.message}`);
    } else {
        console.error("Sitemap Error: An unexpected error occurred.", error);
    }
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = [
    { url: `${baseUrl}/`, priority: 1.0 },
    { url: `${baseUrl}/products`, priority: 0.9 },
    { url: `${baseUrl}/about`, priority: 0.7 },
    { url: `${baseUrl}/contact`, priority: 0.6 },
    { url: `${baseUrl}/faq`, priority: 0.6 },
    { url: `${baseUrl}/offer`, priority: 0.8 },
  ].map((route) => ({
    ...route,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
  }));

  const allProducts = await fetchAllPublicProducts();

  const productsUrls = allProducts.map((product) => {
    // === THIS IS THE ONLY LINE THAT CHANGED ===
    // We are now using product._id instead of product.name for the URL.
    return {
      url: `${baseUrl}/products/${product._id}`,
      lastModified: new Date(product.updatedAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [...staticUrls, ...productsUrls];
}