"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { PublicUserProfile } from '@/lib/types';
import axios from 'axios';

export const useUser = (userId: string | null) => {
  const [data, setData] = useState<PublicUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
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
        const response = await apiClient.users.getPublicProfileById(userId, controller.signal);
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(`Failed to fetch user ${userId}.`, err);
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [userId]);

  return { data, isLoading, error };
};