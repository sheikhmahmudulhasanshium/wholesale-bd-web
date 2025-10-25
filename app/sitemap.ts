// app/sitemap.ts

import { MetadataRoute } from 'next';
import axios from 'axios';

// --- Re-define a simple Product type here ---
// We only need what the sitemap requires.
type Product = {
  name: string;
  updatedAt: string;
};

// Use environment variables for the URL.
const baseUrl = process.env.VERCEL_URL
  ? `https://` + process.env.VERCEL_URL
  : 'http://localhost:3000';

// This is our lean, server-safe fetcher function, living right here.
async function fetchAllPublicProducts(): Promise<Product[]> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/public/all`;
    console.log(`Sitemap: Fetching products from ${apiUrl}`);

    // Create a plain axios instance ONLY for this task.
    // No interceptors, no client-side logic.
    const response = await axios.get<{ data: Product[] }>(apiUrl);

    // Assuming your API response is { "data": [...] }
    const products = response.data.data;

    if (Array.isArray(products)) {
      return products;
    } else {
      console.error("Sitemap Error: API did not return a valid array.");
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error(`Sitemap Error: Failed to fetch public products. Status: ${error.response?.status}, Message: ${error.message}`);
    } else {
        console.error("Sitemap Error: An unexpected error occurred while fetching products.", error);
    }
    return []; // Return an empty array on failure so the build succeeds.
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

  // --- Directly call our local fetcher function ---
  const allProducts = await fetchAllPublicProducts();

  const productsUrls = allProducts.map((product) => {
    const slug = encodeURIComponent(product.name);
    return {
      url: `${baseUrl}/products/${slug}`,
      lastModified: new Date(product.updatedAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [...staticUrls, ...productsUrls];
}