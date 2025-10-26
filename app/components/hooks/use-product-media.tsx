"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { GroupedMedia } from '@/lib/types';
import axios from 'axios';

/**
 * Fetches all media (images, videos, links) associated with a specific product ID.
 * @param productId The ID of the product.
 * @returns An object containing the media data, loading state, and any errors.
 */
export const useProductMedia = (productId: string | null) => {
  const [data, setData] = useState<GroupedMedia | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If we don't have a product ID yet, just wait.
    if (!productId) {
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await apiClient.uploads.getMediaForEntity('Product', productId, controller.signal);
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