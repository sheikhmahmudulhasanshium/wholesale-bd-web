// @/lib/types.ts

import type { Metadata } from 'next';
// @/lib/types.ts

// --- Auth & User Types ---
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "seller" | "admin";
  profilePicture?: string;
  businessName?: string;
  businessDescription?:string
  phone?: string;
  memberSince?:string;
  isTrustedUser?:boolean
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// --- Core Data Structures ---
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
  maxQuantity?: number;
  pricePerUnit: number;
  _id?: string;
}

// --- NEW: Media & Upload Types ---
export interface Media {
  _id: string;
  url: string;
  mediaType: 'image' | 'video' | 'audio' | 'link';
  mimeType?: string;
  originalName?: string;
  productId?: string;
}

export interface GroupedMedia {
  images: Media[];
  videos: Media[];
  audio: Media[];
  links: Media[];
}

// --- UPDATED: The Product type no longer contains an 'images' property ---
export interface Product {
  _id: string;
  name: string;
  description: string;
  // images?: string[]; // This property is now removed
  sellerId: string;
  categoryId: string;
  zoneId: string;
  pricingTiers: PricingTier[];
  stockQuantity: number;
  minimumOrderQuantity: number;
  unit: string;
  status: "active" | "inactive" | "out_of_stock" | "pending_approval";
  isActive: boolean;
  viewCount: number;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
  brand?: string;
  model?: string;
  weight?: number;
  dimensions?: string;
  specifications?: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
}

// --- Collection Types ---
export interface CollectionProduct {
  product: Product;
  priority: number;
}

export interface Collection {
  _id: string;
  title: string;
  title_bn: string;
  url: string;
  lucide_react_icon?: string;
  end_date?: string;
  products: CollectionProduct[];
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
  isActive:boolean;
  sortingOrder?: number;
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
  name_bn?:string
  description: string;
  images?: string[];
  sellerId: string;
  categoryId: string;
  zoneId: string;
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