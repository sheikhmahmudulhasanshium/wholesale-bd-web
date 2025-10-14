// FILE: @/app/components/hooks/use-update-product.tsx

"use client";

import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';

export const useUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProduct = useCallback(async (productId: string, formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.products.update(productId, formData);
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