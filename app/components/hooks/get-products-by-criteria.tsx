"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Product } from '@/lib/types';
import axios from 'axios';

type CriteriaType = 'category' | 'zone' | 'seller';

interface UseProductsByCriteriaProps {
  type: CriteriaType;
  id: string | null;
}

/**
 * A reusable hook to fetch a list of public products based on a specific criterion.
 * @param {CriteriaType} type - The type of criteria to filter by ('category', 'zone', or 'seller').
 * @param {string | null} id - The MongoDB ObjectId for the given criteria type.
 * @returns An object containing the product data, loading state, and any errors.
 */
export const useProductsByCriteria = ({ type, id }: UseProductsByCriteriaProps) => {
  const [data, setData] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If there's no ID, don't attempt to fetch.
    if (!id) {
      setIsLoading(false);
      setData(null);
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null); // Clear previous data on new fetch

      try {
        let response;
        switch (type) {
          case 'category':
            response = await apiClient.products.getByCategoryIdPublic(id, controller.signal);
            break;
          case 'zone':
            response = await apiClient.products.getByZoneIdPublic(id, controller.signal);
            break;
          case 'seller':
            response = await apiClient.products.getBySellerIdPublic(id, controller.signal);
            break;
          default:
            throw new Error(`Invalid criteria type: ${type}`);
        }
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

    // Cleanup function to abort the request if the component unmounts or dependencies change.
    return () => controller.abort();
  }, [type, id]); // Re-run the effect if the type or id changes

  return { data, isLoading, error };
};