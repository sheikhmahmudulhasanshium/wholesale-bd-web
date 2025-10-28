// FILE: @/app/components/hooks/use-update-product.tsx

"use client";

import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { Product } from '@/lib/types'; // Import the Product type

export const useUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // FIX: The function now accepts a plain object of type Partial<Product>, not FormData.
  const updateProduct = useCallback(async (productId: string, data: Partial<Product>) => {
    setIsLoading(true);
    setError(null);
    try {
      // FIX: We now pass the plain 'data' object.
      const response = await apiClient.products.update(productId, data);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateProduct, isLoading, error };
};