// FILE: @/app/components/hooks/use-products.tsx

"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
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
        const response = await apiClient.products.getAll(filters, controller.signal);
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
    // FIX: Suppress linting for this line as using JSON.stringify is intentional for deep equality checking
    // Using the raw 'filters' object here might lead to infinite loops if the object reference changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error };
};