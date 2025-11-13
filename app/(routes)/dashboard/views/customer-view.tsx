// app/dashboard/views/customer-view.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, History, Heart } from 'lucide-react';
import { useDashboardStats } from '@/app/components/hooks/use-dashboard-stats';

interface CustomerDashboardViewProps {
  stats: ReturnType<typeof useDashboardStats>['stats'];
  isLoading: boolean;
}

export function CustomerDashboardView({ stats, isLoading }: CustomerDashboardViewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5"/> My Recent Orders</CardTitle>
          <CardDescription>An overview of your last few orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground italic py-8">
            <p>Order history will be shown here.</p>
            <Button variant="link" asChild className="mt-2">
                <Link href="/dashboard/orders">View All Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="h-5 w-5"/> Recent Search History</CardTitle>
          <CardDescription>Your last 10 search queries.</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.userActivity?.recentSearches && stats.userActivity.recentSearches.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.userActivity.recentSearches.map((term, i) => (
                <Link key={i} href={`/search?q=${encodeURIComponent(term)}`}>
                  <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">{term}</Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No recent search history found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}