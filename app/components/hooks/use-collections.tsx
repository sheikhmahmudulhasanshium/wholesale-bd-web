"use client";

// @/lib/types.ts

// --- Basic User & Auth Types ---


export interface AuthResponse {
  access_token: string;
  user: User;
}

// --- Basic App Data Types ---
export interface Category {
  _id: string;
  name: string;
}

export interface Zone {
  _id: string;
  name: { en: string; bn: string };
}

// --- Product & Collection Types ---

export interface ProductImage {
  url: string;
  public_id: string;
}

export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
}

// THIS IS THE COMPLETE AND ACCURATE PRODUCT TYPE
export interface Product {
  _id: string;
  name: string;
  name_bn?: string;
  description: string;
  images?: ProductImage[]|string[]|undefined; // This must be ProductImage[] to match your data
  categoryId: string;
  zoneId: string;
  sellerId: string;
  pricingTiers: PricingTier[];
  minimumOrderQuantity: number;
  stockQuantity: number;
  unit: string;
  brand: string;
  model: string;
  specifications: string;
  status: string;
  viewCount: number;
  orderCount: number;
  rating: number;
  reviewCount: number;
  sku: string;
  weight: number;
  dimensions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionProduct {
  product: Product;
  priority: number;
}

export interface Collection {
  _id:string;
  title: string;
  title_bn: string;
  url: string;
  lucide_react_icon?: string;
  end_date?: string;
  products: CollectionProduct[];
}
// @/app/components/hooks/use-collections.ts

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { User } from '@/lib/types';
// The 'User' type was imported but not used. It can be removed.

// --- THIS IS THE FIX ---
// Import the Collection type from your single source of truth (Done above)

// Define the return type for the hook
export interface UseCollectionsReturn {
  collections: Collection[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.collections.findAllPublic();
        setCollections(response.data);
      } catch (err) { // `err` is of type `unknown` by default
        // FIX: Check if the caught object is an instance of Error.
        // If not, create a new Error object to ensure type safety for the state.
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unexpected error occurred.'));
        }
        console.error("Failed to fetch collections:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { collections, isLoading, error };
}