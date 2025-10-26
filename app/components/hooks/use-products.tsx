"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
// --- FIX: Import Product type, remove unused Paginated types ---
import { Product, ProductQuery } from '@/lib/types'; 
import axios from 'axios';

export const useProducts = (filters: ProductQuery) => {
  // --- FIX: The data is now a simple array of Products ---
  const [data, setData] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- FIX: Call the public endpoint that returns a simple array ---
        // Note: The 'filters' object will be ignored by this specific endpoint,
        // but we leave it for potential future backend enhancements.
        const response = await apiClient.products.getAllPublic(controller.signal);
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled');
          return;
        }
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  // --- FIX: The returned data is now Product[] | null ---
  return { data, isLoading, error };
};