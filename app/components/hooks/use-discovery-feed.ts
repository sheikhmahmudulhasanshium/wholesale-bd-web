// @/app/components/hooks/use-discovery-feed.ts
"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { DiscoveryResponse } from '@/lib/types';
import axios from 'axios';
import { useAuth } from '../contexts/auth-context';

export const useDiscoveryFeed = () => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<DiscoveryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only fetch the discovery feed if the user is authenticated.
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await apiClient.search.getDiscoveryFeed(controller.signal);
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          // We don't show a toast here, as it's a non-critical feature.
          console.error("Failed to fetch discovery feed:", err);
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [isAuthenticated]); // Re-run when authentication status changes.

  return { data, isLoading, error };
};