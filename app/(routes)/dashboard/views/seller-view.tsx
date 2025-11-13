// app/dashboard/views/seller-view.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, ShoppingCart, History, BarChart2 } from 'lucide-react';
import { useDashboardStats } from '@/app/components/hooks/use-dashboard-stats';

interface SellerDashboardViewProps {
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

export function SellerDashboardView({ stats, isLoading }: SellerDashboardViewProps) {
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
        <StatCard title="My Products" value={stats?.myProductsCount ?? 0} icon={Package} description="Active listings" />
        <StatCard title="Total Sales" value={`৳${stats?.totalSales ?? '0.00'}`} icon={DollarSign} description="+20.1% from last month" />
        <StatCard title="New Orders" value={stats?.newOrdersCount ?? 0} icon={ShoppingCart} description="Pending fulfillment" />
      </div>

      {/* === Second Row Infographics === */}
      <div className="grid gap-8 lg:grid-cols-2">
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
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5"/> My Top Products</CardTitle>
            <CardDescription>Your most viewed products this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between"><span>Product A</span> <span>128 views</span></li>
                <li className="flex justify-between"><span>Product B</span> <span>97 views</span></li>
                <li className="flex justify-between"><span>Product C</span> <span>85 views</span></li>
                <li className="flex justify-between"><span>Product D</span> <span>62 views</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}