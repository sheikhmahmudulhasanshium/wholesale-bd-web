// @/app/components/hooks/use-search.ts
"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { SearchResponse } from '@/lib/types';
import axios from 'axios';

interface UseSearchProps {
  query: string | null;
  page?: number;
  limit?: number;
}

export const useSearch = ({ query, page = 1, limit = 20 }: UseSearchProps) => {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If there's no query, don't attempt to fetch.
    if (!query) {
      setIsLoading(false);
      setData(null);
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await apiClient.search.getResults({ q: query, page, limit }, controller.signal);
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Failed to fetch search results:", err);
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [query, page, limit]);

  return { data, isLoading, error };
};