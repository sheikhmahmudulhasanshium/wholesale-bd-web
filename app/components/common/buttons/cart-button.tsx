// @/app/components/common/buttons/cart-button.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../../contexts/cart-context';
import { useAuth } from '../../contexts/auth-context';

export const CartButton = () => {
  const { cartSummary, isLoading } = useCart();
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();

  const [showBadge, setShowBadge] = useState(true);
  const totalQuantity = cartSummary?.totalQuantity ?? 0;

  // --- VVVVVV THIS IS THE REFACTORED LOGIC VVVVVV ---

  // Use a ref to track the previous quantity without causing re-renders
  const prevQuantityRef = useRef<number>(totalQuantity);

  useEffect(() => {
    // Effect 1: Handles hiding the badge when navigating to the cart page.
    // This is simple and only depends on the pathname.
    if (pathname === '/cart') {
      setShowBadge(false);
    }
  }, [pathname]);

  useEffect(() => {
    // Effect 2: Handles showing the badge when the quantity changes.
    // This effect runs whenever totalQuantity is updated.
    
    // Check if the user is NOT on the cart page AND the quantity has actually increased.
    if (pathname !== '/cart' && totalQuantity > prevQuantityRef.current) {
      setShowBadge(true);
    }

    // After every run, update the ref to the current quantity for the next comparison.
    prevQuantityRef.current = totalQuantity;
  }, [totalQuantity, pathname]);

  // --- ^^^^^^ END OF REFACTORED LOGIC ^^^^^^ ---

  if (!isAuthenticated || user?.role === 'admin') {
    return null;
  }

  const handleClick = () => {
    // This remains the same: clicking the button is an explicit action
    // by the user to acknowledge the notification.
    setShowBadge(false);
  };

  return (
    <Button
      asChild
      className="group relative inline-flex items-center justify-center p-3 m-2 rounded-full bg-primary text-secondary hover:bg-secondary hover:scale-110 transition-all duration-300 ease-in-out shadow-lg transform hover:text-white"
    >
      <Link href="/cart#summary" onClick={handleClick}>
        <LucideShoppingCart className="m-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-2" />
        <span className="sr-only">View Cart</span>

        {!isLoading && totalQuantity > 0 && showBadge && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full p-0 text-xs font-bold"
          >
            {totalQuantity}
          </Badge>
        )}
      </Link>
    </Button>
  );
};