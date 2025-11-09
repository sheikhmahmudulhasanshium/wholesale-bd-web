import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Category } from '@/lib/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // This self-invoking async function pattern is clean and matches your other hooks.
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // We use your existing apiClient instance and method.
        const response = await apiClient.products.getCategories();
        setCategories(response.data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unexpected error occurred');
        console.error("Failed to fetch categories:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount.

  return { categories, isLoading, error };
}