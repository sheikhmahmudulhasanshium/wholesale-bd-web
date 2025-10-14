// FILE: @/lib/types.ts

// --- Auth & User Types ---
export interface User {
  _id: string; // Backend uses _id
  id: string; // Often added on the frontend for convenience, but let's stick to the backend schema
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'seller' | 'admin';
  profilePicture?: string;
  businessName?: string; // Add other fields from your User schema
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// --- Core Data Structures (from your backend schemas) ---

export interface Seller {
  _id: string;
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
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
  maxQuantity?: number;
  pricePerUnit: number;
  _id?: string;
}

export interface Product {
  _id:string;
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
  status: 'active' | 'inactive' | 'out_of_stock' | 'pending_approval';
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- API Query & Response Types ---

export interface ProductQuery {
  search?: string;
  categoryId?: string;
  zoneId?: string;
  sellerId?: string;
  status?: 'active' | 'inactive' | 'out_of_stock';
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'price' | 'name' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
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