// @/app/(routes)/products/[id]/components/ProductNotFoundError.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ApiErrorData {
  message?: string;
}

interface ProductNotFoundErrorProps {
  error: AxiosError | null;
}

export const ProductNotFoundError: React.FC<ProductNotFoundErrorProps> = ({ error }) => {
  const errorMessage =
    error && error.response?.data
      ? (error.response.data as ApiErrorData).message
      : "The product you're looking for doesn't exist or has been removed.";

  return (
    <Card className="border-destructive max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-destructive">
          <AlertTriangle size={48} />
          Product Not Found
        </CardTitle>
        <CardDescription>{errorMessage}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-3 mt-4">
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        <Button asChild><Link href="/products">See All Products</Link></Button>
      </CardContent>
    </Card>
  );
};