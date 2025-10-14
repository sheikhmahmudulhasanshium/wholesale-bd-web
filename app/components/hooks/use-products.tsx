// FILE: @/app/components/hooks/use-products.tsx

"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient'; // ✅ FIXED: Import the main apiClient
import { ProductQuery, PaginatedProductsResponse } from '@/lib/types';
import axios from 'axios';

export const useProducts = (filters: ProductQuery) => {
  const [data, setData] = useState<PaginatedProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ✅ FIXED: Call the method from the correct namespace and pass the signal
        const response = await apiClient.products.getAll(filters, controller.signal);
        setData(response.data); // Axios responses are nested in a `data` property
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
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error };
};