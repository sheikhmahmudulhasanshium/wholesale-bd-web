// @/lib/types.ts

import type { Metadata } from 'next';

// --- Auth & User Types ---
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "seller" | "admin";
  profilePicture?: string;
  businessName?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string; // CHANGED from access_token
  user: User;
}

// --- Core Data Structures ---
export interface Seller {
  _id: string;
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone?: string;  // Optional field for phone number
  zone?: string;   // Optional field for the zone the seller operates in
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Zone {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;  // Optional maximum quantity
  pricePerUnit: number;
  _id?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  sellerId: Seller;
  categoryId: Category;
  zoneId: Zone;
  pricingTiers: PricingTier[];
  stockQuantity: number;
  minimumOrderQuantity: number;
  unit: string;
  status: "active" | "inactive" | "out_of_stock" | "pending_approval";
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  brand?: string;  // Optional field for product brand
  model?: string;  // Optional field for product model
  weight?: number; // Optional weight field
  dimensions?: string; // Optional product dimensions field
  specifications?: string; // Optional product specifications (e.g., ingredients, details)
  sku?: string; // Optional SKU field for the product
  rating?: number; // Optional rating, could be a numeric score
  reviewCount?: number; // Optional review count
}

// --- API Query & Response Types ---
export interface ProductQuery {
  search?: string;
  categoryId?: string;
  zoneId?: string;
  sellerId?: string;
  status?: "active" | "inactive" | "out_of_stock";
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "price" | "name" | "viewCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- OpenGraph Type Extension (The Fix) ---

// Get the base OpenGraph type directly from the official Next.js Metadata type.
type BaseOpenGraph = NonNullable<Metadata['openGraph']>;

/**
 * Create a new type that extends the official OpenGraph type to support "product".
 */
export type ExtendedOpenGraph = Omit<BaseOpenGraph, 'type'> & {
  type: 'product';
};