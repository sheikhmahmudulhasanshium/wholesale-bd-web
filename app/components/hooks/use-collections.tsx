import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Collection } from '@/lib/types';

export interface UseCollectionsReturn {
  collections: Collection[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCollections(): UseCollectionsReturn {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.collections.findAllPublic();
        setCollections(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unexpected error occurred.'));
        }
        console.error("Failed to fetch collections:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { collections, isLoading, error };
}

