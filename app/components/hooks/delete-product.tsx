// FILE: @/app/components/hooks/use-delete-product.tsx (Create this new file)

"use client";

import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';

export const useDeleteProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteProduct = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.products.delete(productId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteProduct, isLoading, error };
};