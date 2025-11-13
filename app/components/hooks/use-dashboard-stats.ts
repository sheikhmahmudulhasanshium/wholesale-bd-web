// @/app/components/hooks/use-dashboard-stats.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '../contexts/auth-context';
import { Product, UserActivity, DashboardStats } from '@/lib/types';
import axios from 'axios';

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    setError(null);

    try {
      const promises: Promise<unknown>[] = [
        apiClient.users.getMyActivity(signal),
      ];

      if (user.role === 'seller') {
        promises.push(apiClient.products.getBySellerIdPublic(user._id, signal));
        // TODO: Add real API call for newOrdersCount
        // TODO: Add real API call for totalSales
      }

      if (user.role === 'admin') {
        promises.push(apiClient.products.getPublicCount(signal));
        promises.push(apiClient.users.getTotalCount(signal));
        promises.push(apiClient.orders.getOrderAnalytics(signal));
      }

      const results = await Promise.allSettled(promises);

      const newStats: DashboardStats = {};

      const activityResult = results[0];
      if (activityResult.status === 'fulfilled') {
        const response = activityResult.value as { data: UserActivity };
        newStats.userActivity = response.data;
      }

      let promiseIndex = 1;

      if (user.role === 'seller') {
        const myProductsResult = results[promiseIndex++];
        if (myProductsResult.status === 'fulfilled') {
          const response = myProductsResult.value as { data: Product[] };
          newStats.myProductsCount = response.data.length;
        }
        newStats.totalSales = "12,842.50"; // Placeholder data
        newStats.newOrdersCount = 52; // Placeholder data
      }

      if (user.role === 'admin') {
        const productCountResult = results[promiseIndex++];
        if (productCountResult.status === 'fulfilled') {
          const response = productCountResult.value as { data: { totalProducts: number } };
          newStats.totalProducts = response.data.totalProducts;
        }

        const userCountResult = results[promiseIndex++];
        if (userCountResult.status === 'fulfilled') {
          const response = userCountResult.value as { data: { totalUsers: number } };
          newStats.totalUsers = response.data.totalUsers;
        }

        const orderAnalyticsResult = results[promiseIndex++];
        if (orderAnalyticsResult.status === 'fulfilled') {
          const response = orderAnalyticsResult.value as { data: { total: number; pending: number } };
          newStats.pendingOrdersCount = response.data.pending;
        } else {
          newStats.pendingOrdersCount = 0;
        }
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
    
    // The controller is scoped to this function, so no cleanup is needed in useEffect
  }, [user]);

  useEffect(() => {
    // This effect simply calls the memoized fetch function when the user changes.
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};