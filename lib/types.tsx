// @/lib/types.ts

import type { Metadata } from 'next';

// --- Auth & User Types ---

/**
 * Represents the detailed user object for an authenticated user.
 * Based on the backend's `UserResponseDto`.
 */
export interface AuthenticatedUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  address?: string;
  zone?: string;
  isActive: boolean;
  emailVerified: boolean;
  role: 'admin' | 'seller' | 'customer';
  kycStatus: 'approved' | 'pending' | 'rejected' | 'not_started';
  sellerStatus: 'approved' | 'pending' | 'rejected';
  businessName?: string;
  businessDescription?: string;
  isTrustedUser: boolean;
  trustScore: number;
  reviewCount: number;
  submissionCount: number;
  createdAt: string; // Date
  updatedAt: string; // Date
  lastLogin?: string; // Date
}

/**
 * Represents the public-facing user profile.
 * Based on the backend's `UnifiedPublicProfileDto`.
 */
export interface PublicUserProfile {
  _id: string;
  displayName: string;
  role: 'admin' | 'seller' | 'customer';
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  profilePicture?: string | null;
  backgroundPicture?: string | null;
  zone?: string;
  trustScore?: number;
  isTrustedUser?: boolean;
  memberSince: string; // Date is serialized as string
}

export interface AuthResponse {
  token: string;
  user: AuthenticatedUser;
}

// --- Core Data Structures ---
export interface Seller {
  _id: string;
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone?: string;
  zone?: string;
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
  isActive: boolean;
  sortingOrder?: number;
}

export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  _id?: string;
}

// --- Media & Upload Types ---
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

export interface Product {
  _id: string;
  name: string;
  name_bn?: string;
  description: string;
  images?: string[]; // Note: For new features, consider fetching media separately
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

// --- OpenGraph Type Extension ---
type BaseOpenGraph = NonNullable<Metadata['openGraph']>;

export type ExtendedOpenGraph = Omit<BaseOpenGraph, 'type'> & {
  type: 'product';
};