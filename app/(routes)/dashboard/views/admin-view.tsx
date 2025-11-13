// app/dashboard/views/admin-view.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Package, Users, ShoppingCart, History, BarChart2 } from 'lucide-react';
import { useDashboardStats } from '@/app/components/hooks/use-dashboard-stats';

interface AdminDashboardViewProps {
  stats: ReturnType<typeof useDashboardStats>['stats'];
  isLoading: boolean;
}

const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: React.ElementType, description?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

export function AdminDashboardView({ stats, isLoading }: AdminDashboardViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[108px] w-full" />
          <Skeleton className="h-[108px] w-full" />
          <Skeleton className="h-[108px] w-full" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* === Top Row Stat Cards === */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} description="Across all sellers" />
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} description="Customers & Sellers" />
        <StatCard title="Pending Orders" value={stats?.pendingOrdersCount ?? 0} icon={ShoppingCart} description="Awaiting fulfillment" />
      </div>

      {/* === Second Row Infographics === */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History className="h-5 w-5"/> Recent Platform Searches</CardTitle>
            <CardDescription>Last 10 search queries from all users.</CardDescription>
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
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5"/> Platform Analytics</CardTitle>
            <CardDescription>This is a placeholder for platform-wide analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>New Users Today</span> <span>15</span></li>
              <li className="flex justify-between"><span>Products Added Today</span> <span>42</span></li>
              <li className="flex justify-between"><span>Total Revenue (Month)</span> <span>৳250,430.00</span></li>
              <li className="flex justify-between"><span>API Health</span> <span className="text-green-500 font-semibold">Healthy</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}