// @/app/components/hooks/use-dashboard-stats.ts
"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '../contexts/auth-context';
import { Product, UserActivity } from '@/lib/types';
import axios from 'axios';

export interface DashboardStats {
  totalProducts?: number;
  myProductsCount?: number;
  totalUsers?: number;
  userActivity?: UserActivity | null;
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // --- V FIX: Use `Promise<unknown>[]` instead of `Promise<any>[]` for type safety ---
        const promises: Promise<unknown>[] = [
          apiClient.users.getMyActivity(controller.signal)
        ];

        if (user.role === 'seller') {
            promises.push(apiClient.products.getBySellerIdPublic(user._id, controller.signal));
        }

        if (user.role === 'admin') {
            promises.push(apiClient.products.getPublicCount(controller.signal));
            promises.push(apiClient.users.getTotalCount(controller.signal));
        }

        const results = await Promise.all(promises);
        
        const newStats: DashboardStats = {};
        
        // The type casts below are now safe because we are explicitly defining the expected shape.
        const activityResponse = results[0] as { data: UserActivity };
        newStats.userActivity = activityResponse.data;

        let promiseIndex = 1;

        if (user.role === 'seller') {
            const myProductsResponse = results[promiseIndex++] as { data: Product[] };
            newStats.myProductsCount = myProductsResponse.data.length;
        }

        if (user.role === 'admin') {
            const productCountResponse = results[promiseIndex++] as { data: { totalProducts: number } };
            const userCountResponse = results[promiseIndex++] as { data: { totalUsers: number } };

            newStats.totalProducts = productCountResponse.data.totalProducts;
            newStats.totalUsers = userCountResponse.data.totalUsers;
        }

        setStats(newStats);
        
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Failed to fetch dashboard stats:", err);
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [user]);

  return { stats, isLoading, error };
};