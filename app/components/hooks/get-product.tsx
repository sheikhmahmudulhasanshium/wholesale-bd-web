// FILE: @/app/components/hooks/use-product.tsx

"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Product } from '@/lib/types';
import axios from 'axios';

export const useProduct = (productId: string | null) => {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.products.getById(productId, controller.signal);
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [productId]);

  return { data, isLoading, error };
};