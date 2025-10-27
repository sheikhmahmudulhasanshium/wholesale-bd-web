"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { User } from '@/lib/types';
import axios from 'axios';

export const useUser = (userId: string | null) => {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        // Calling the protected endpoint. This may fail if not logged in.
        const response = await apiClient.users.getById(userId, controller.signal);
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(`Failed to fetch user ${userId}. A public endpoint may be needed, or the user must be logged in.`, err);
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