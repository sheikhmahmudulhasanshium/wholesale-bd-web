// app/(routes)/dashboard/views/admin-view.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// NOTE: AlertDialog import has been removed.
import {
  Package, Users, ShoppingCart, Loader2, RefreshCw, CheckCircle2, XCircle, MoreVertical, Trash2, ShieldAlert
} from 'lucide-react';
import { useDashboardStats } from '@/app/components/hooks/use-dashboard-stats';
import { useAuth } from '@/app/components/contexts/auth-context';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { AxiosError } from 'axios';
import { AuthenticatedUser } from '@/lib/types';

const ROLES: Array<'customer' | 'seller' | 'admin'> = ['customer', 'seller', 'admin'];

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

const AdminDashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-[108px] w-full" />
      <Skeleton className="h-[108px] w-full" />
      <Skeleton className="h-[108px] w-full" />
    </div>
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-w-[700px] border rounded-lg">
          <div className="flex items-center p-3 font-medium text-muted-foreground bg-muted border-b">
            <div className="flex-1">User</div><div className="w-28 text-center">Role</div><div className="w-40 text-center">Status</div><div className="w-16 text-right">Actions</div>
          </div>
          <div>
            {[...Array(5)].map((_, i) => ( <div key={i} className="flex items-center p-3 border-b last:border-b-0"> <div className="flex-1 flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div></div> <div className="w-28 flex justify-center"><Skeleton className="h-6 w-20 rounded-full" /></div> <div className="w-40 flex justify-center gap-4"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /></div> <div className="w-16 flex justify-end"><Skeleton className="h-8 w-8" /></div> </div> ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export function AdminDashboardView({ stats, isLoading: isStatsLoading }: AdminDashboardViewProps) {
  const { user: loggedInUser } = useAuth();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<AuthenticatedUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!loggedInUser) return;
    setIsUsersLoading(true);
    try {
      let response;
      if (statusFilter === 'pending-seller') {
        response = await apiClient.users.adminListPendingSellers();
      } else {
        response = await apiClient.users.adminListAll();
      }
      const initialUserList = response.data;
      const adminInList = initialUserList.find(u => u._id === loggedInUser._id);
      
      const finalUserList = (
        !adminInList && statusFilter !== 'pending-seller' 
          ? [loggedInUser, ...initialUserList] 
          : initialUserList
      );
      setAllUsers(finalUserList);

    } catch (error) {
      toast.error('Failed to fetch user list.');
    } finally {
      setIsUsersLoading(false);
    }
  }, [loggedInUser, statusFilter]);

  useEffect(() => {
    if (loggedInUser) { fetchUsers(); }
  }, [fetchUsers, loggedInUser]);

  const filteredUsers = useMemo(() => {
    if (statusFilter === 'pending-seller') {
        return allUsers.filter(user => 
            searchTerm.length < 2 || 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return allUsers.filter(user => {
      const searchMatch = searchTerm.length < 2 || `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      const statusMatch = statusFilter === 'all' ||
        (statusFilter === 'verified' && user.emailVerified) ||
        (statusFilter === 'unverified' && !user.emailVerified) ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'blocked' && !user.isActive);
      return searchMatch && roleMatch && statusMatch;
    });
  }, [allUsers, searchTerm, roleFilter, statusFilter]);

  const handleManualVerify = async (userId: string) => {
    setActionInProgress(userId);
    try {
      await apiClient.users.adminVerify(userId);
      toast.success('User successfully verified.');
      await fetchUsers();
    } catch (error) {
      const errorMessage = 'Verification failed.';
      if (error instanceof AxiosError && error.response?.data?.message) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const a: string = error.response.data.message as string;
      }
      toast.error(errorMessage);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleUpdateRole = async (user: AuthenticatedUser, newRole: 'customer' | 'seller' | 'admin') => {
    setActionInProgress(user._id);
    try {
      await apiClient.users.adminUpdateRole(user._id, { role: newRole });
      toast.success(`Role for ${user.firstName} updated to ${newRole}.`);
      await fetchUsers();
    } catch (error) {
      let errorMessage = 'Role update failed.';
       if (error instanceof AxiosError && error.response?.data?.message) { errorMessage = error.response.data.message as string; }
      toast.error(errorMessage);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteUser = async (user: AuthenticatedUser) => {
    setActionInProgress(user._id);
    try {
      await apiClient.users.adminDelete(user._id);
      toast.success(`User ${user.email} has been deleted.`);
      await fetchUsers();
    } catch (error) {
      let errorMessage = 'Failed to delete user.';
       if (error instanceof AxiosError && error.response?.data?.message) { errorMessage = error.response.data.message as string; }
      toast.error(errorMessage);
    } finally {
       setActionInProgress(null);
    }
  }

  if (!isMounted || isStatsLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} description="Across all sellers" />
        <StatCard title="Total Users" value={allUsers.length} icon={Users} description="Customers & Sellers" />
        <StatCard title="Pending Orders" value={stats?.pendingOrdersCount ?? 0} icon={ShoppingCart} description="Awaiting fulfillment" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> All Users</CardTitle><CardDescription>View, filter, and manage all users on the platform.</CardDescription></div>
            <div className="flex items-center gap-2"><Input placeholder="Search name or email..." className="w-full sm:w-auto" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><Button variant="outline" size="icon" onClick={fetchUsers} disabled={isUsersLoading}><RefreshCw className={`h-4 w-4 ${isUsersLoading ? 'animate-spin' : ''}`} /></Button></div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
              <Select value={roleFilter} onValueChange={setRoleFilter} disabled={statusFilter === 'pending-seller'}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter by role..." /></SelectTrigger><SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="seller">Seller</SelectItem><SelectItem value="customer">Customer</SelectItem></SelectContent></Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status..." /></SelectTrigger><SelectContent><SelectItem value="all">All General Statuses</SelectItem><SelectItem value="pending-seller">Pending Sellers</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="blocked">Blocked</SelectItem><SelectItem value="verified">Verified</SelectItem><SelectItem value="unverified">Unverified</SelectItem></SelectContent></Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="min-w-[700px] border rounded-lg">
              <div className="flex items-center p-3 font-medium text-muted-foreground bg-muted border-b"><div className="flex-1">User</div><div className="w-28 text-center">Role</div><div className="w-40 text-center">Status</div><div className="w-16 text-right">Actions</div></div>
              <div>
                {isUsersLoading ? (
                  [...Array(5)].map((_, i) => ( <div key={i} className="flex items-center p-3 border-b last:border-b-0"> <div className="flex-1 flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div></div> <div className="w-28 flex justify-center"><Skeleton className="h-6 w-20 rounded-full" /></div> <div className="w-40 flex justify-center gap-4"><Skeleton className="h-5 w-5 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /></div> <div className="w-16 flex justify-end"><Skeleton className="h-8 w-8" /></div> </div> ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user._id} className="flex items-center p-2 border-b last:border-b-0">
                      <div className="flex-1 flex items-center gap-3 min-w-0"><Avatar className="h-10 w-10"><AvatarImage src={user.profilePicture || '/logo/logo.png'} alt={`${user.firstName}'s avatar`} /><AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback></Avatar><div className="min-w-0"><Link href={`/profile/${user._id}`} className="font-medium text-sm truncate block hover:underline">{user.firstName} {user.lastName}</Link><p className="text-xs text-muted-foreground truncate">{user.email}</p></div></div>
                      <div className="w-28 flex justify-center"><Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'seller' ? 'secondary' : 'outline'}>{user.role}</Badge></div>
                      <div className="w-40 flex items-center justify-center gap-4"><span title={user.emailVerified ? "Email Verified" : "Email Not Verified"}>{user.emailVerified ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}</span><Badge variant={user.isActive ? 'default' : 'destructive'}>{user.isActive ? 'Active' : 'Blocked'}</Badge></div>
                      <div className="w-16 flex justify-end">
                        {actionInProgress === user._id ? (<Loader2 className="h-5 w-5 animate-spin mr-1.5" />) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!user.emailVerified && (<DropdownMenuItem onClick={() => handleManualVerify(user._id)}>Verify Email</DropdownMenuItem>)}
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                                <DropdownMenuPortal><DropdownMenuSubContent>{ROLES.map((role) => (<DropdownMenuItem key={role} disabled={user.role === role} onClick={() => handleUpdateRole(user, role)}>Set as {role.charAt(0).toUpperCase() + role.slice(1)}</DropdownMenuItem>))}</DropdownMenuSubContent></DropdownMenuPortal>
                              </DropdownMenuSub>
                              {loggedInUser?._id !== user._id && (<>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="text-red-600 focus:bg-red-50 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete User</DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                      <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600" onClick={() => handleDeleteUser(user)}>
                                        <ShieldAlert className="mr-2 h-4 w-4" />
                                        Confirm Permanent Deletion
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                              </>)}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))
                ) : (<div className="text-center h-24 flex items-center justify-center text-muted-foreground">No users match the current filters.</div>)}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}