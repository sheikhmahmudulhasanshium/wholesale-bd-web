// app/sitemap.ts

import { MetadataRoute } from 'next';

// This is a placeholder for your product type.
// Create a type that matches the structure of your product data.
type Product = {
  id: string;
  name: string; // Used to create a URL-friendly slug
  updatedAt: string; // Assuming you have a date field
};

// IMPORTANT: Replace with your actual base URL
const BASE_URL = 'https://wholesale-bd-web-app.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all your products
  // IMPORTANT: Replace this with the actual URL of your API endpoint that returns all products
  const res = await fetch(`${BASE_URL}/api/products`);
  const allProducts: Product[] = await res.json();

  const productsUrls = allProducts.map((product) => {
    // We need to encode the product name to make it safe for a URL
    const slug = encodeURIComponent(product.name);
    return {
      url: `${BASE_URL}/products/${slug}`,
      lastModified: new Date(product.updatedAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  // 2. Define your static pages
  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/offer`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // 3. Combine static and dynamic URLs
  return [...staticUrls, ...productsUrls];
}