// @/lib/types.ts

import type { Metadata } from 'next';

// --- Auth & User Types ---
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
export interface ProductMedia {
  _id: string;
  url: string;
  purpose: 'thumbnail' | 'preview';
  priority: number;
}
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
export interface Review {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  name_bn?: string;
  description: string;
  images?: string[];
  thumbnail: ProductMedia | null;
  previews: ProductMedia[];
  sellerId: string;
  categoryId: string;
  zoneId: string;
  regularUnitPrice: number;
  pricingTiers: PricingTier[];
  stockQuantity: number;
  minimumOrderQuantity: number;
  unit: string;
  status: 'active' | 'inactive' | 'archived';
  isActive: boolean;
  viewCount: number;
  orderCount?: number;
  createdAt: string;
  updatedAt: string;
  brand: string;
  model: string;
  weight?: number;
  dimensions?: string;
  specifications?: string;
  sku?: string;
  rating: number;
  reviewCount: number;
  __v: number;
  tags: string[];
  reviews: Review[];
}

// --- Cart Related Types ---
export interface CartProduct {
  _id: string;
  name: string;
  unit: string;
  minimumOrderQuantity: number;
  thumbnail: ProductMedia | null;
}
export interface CartItem {
  product: CartProduct;
  quantity: number;
  pricing: {
    unitPrice: number;
    itemTotal: number;
  };
  warnings: string[];
}
export interface CartSeller {
  _id: string;
  businessName: string;
}
export interface SellerItemGroup {
  seller: CartSeller;
  items: CartItem[];
}
export interface Cart {
  _id: string;
  status: string;
  itemsBySeller: SellerItemGroup[];
  summary: {
    totalUniqueItems: number;
    totalQuantity: number;
    grandTotal: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartSearchResult {
  seller: {
    _id: string;
    businessName: string;
  };
  product: {
    _id: string;
    name: string;
  };
  quantity: number;
  pricing: {
    unitPrice: number;
    itemTotal: number;
  };
  warnings: string[];
}

export interface AdminCartView {
  _id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  summary: {
    totalUniqueItems: number;
    totalQuantity: number;
    grandTotal: number;
  };
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string | null;
  };
  itemsBySeller: SellerItemGroup[];
}

export interface PaginatedAdminCartResponse {
  data: AdminCartView[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductDetails {
  thumbnailUrl: string | null;
  minimumOrderQuantity: number;
  regularUnitPrice: number;
  pricingTiers: { minQuantity: number; pricePerUnit: number }[];
}

// --- Order Related Types ---
export interface OrderItem {
  productId: string;
  productName: string;
  productSku?: string;
  thumbnailUrl?: string;
  quantity: number;
  pricePerUnitAtOrder: number;
  totalPrice: number;
  productImage?: string | null;
}
export interface ShippingAddress {
  fullName: string;
  addressLine?: string;
  city: string;
  zone: string;
  phone?: string;
  address?: string;
  postalCode?: string;
}
export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status:
    | 'pending_approval'
    | 'processing'
    | 'ready_for_dispatch'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'rejected'
    | 'pending';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  customerId?: string;
  sellerId?: string;
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  paymentMethod?: string;
  notes?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

// --- Other types ---
export interface CollectionProduct {
  product: Product;
  priority: number;
}
export interface Collection {
  _id: string;
  title: string;
  title_bn: string;
  description?: string;
  description_bn?: string;
  url: string;
  lucide_react_icon?: string;
  priority: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  products: CollectionProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
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

type BaseOpenGraph = NonNullable<Metadata['openGraph']>;
export type ExtendedOpenGraph = Omit<BaseOpenGraph, 'type'> & {
  type: 'product';
};
export interface SearchResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  suggestion?: string;
}
export interface DiscoverySection {
  title: string;
  items: Product[];
}
export interface DiscoveryResponse {
  recentlyViewed?: Product[];
  recommendedForYou?: DiscoverySection;
  trendingNow?: DiscoverySection;
}
export interface UserActivity {
  _id: string;
  userId: string;
  viewedProducts: string[];
  likedCategories: string[];
  recentSearches: string[];
  createdAt: string;
  updatedAt: string;
}