// @/app/(routes)/products/[id]/components/SellerInfoCard.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/app/components/hooks/use-user';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, ShieldCheck, CalendarDays } from 'lucide-react';

interface SellerInfoCardProps {
  sellerId: string;
}

export const SellerInfoCard: React.FC<SellerInfoCardProps> = ({ sellerId }) => {
  const { data: seller, isLoading } = useUser(sellerId);

  const getInitials = (displayName?: string) => {
    if (!displayName) return '??';
    const parts = displayName.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
  };

  const memberSinceFormatted = seller?.memberSince
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(seller.memberSince))
    : null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6" /> Seller Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-24" /></div>
          </div>
          <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
        </CardContent>
        <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
      </Card>
    );
  }

  if (!seller) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6" /> Seller Information</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Seller details could not be loaded.</p></CardContent>
        <CardFooter><Button variant="outline" className="w-full" asChild><Link href={`/profile/${sellerId}`}>View Profile</Link></Button></CardFooter>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6" /> Seller Information</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={seller.profilePicture ?? undefined} alt={seller.displayName} />
            <AvatarFallback>{getInitials(seller.displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-bold">{seller.displayName}</p>
            {seller.contactName && <p className="text-sm text-muted-foreground">{seller.contactName}</p>}
          </div>
        </div>
        {seller.isTrustedUser && (
          <Badge variant="secondary" className="w-full justify-center py-2 text-base font-semibold border-green-500 text-green-600">
            <ShieldCheck className="h-5 w-5 mr-2" /> Trusted Seller
          </Badge>
        )}
        {memberSinceFormatted && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
            <CalendarDays className="h-4 w-4" /> Member since {memberSinceFormatted}
          </div>
        )}
      </CardContent>
      <CardFooter><Button variant="outline" className="w-full" asChild><Link href={`/profile/${seller._id}`}>View Profile</Link></Button></CardFooter>
    </Card>
  );
};