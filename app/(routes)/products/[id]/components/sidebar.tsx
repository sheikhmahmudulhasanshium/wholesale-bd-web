// @/app/(routes)/products/[id]/components/sidebar.tsx

"use client";

import { CartButton } from '@/app/components/common/buttons/cart-button';
import { useAuth } from '@/app/components/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon, ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// --- FIX: Import useEffect ---
import { useState, useEffect } from 'react';

// Define props for the AddToCart component
interface AddToCartProps {
  productId: string;
}

const AddToCart = ({ productId }: AddToCartProps) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? (
    <Button asChild>
      <Link href={`/products/${productId}#add-to-cart`}>
        <ShoppingCartIcon />
      </Link>
    </Button>
  ) : (
    <CartButton />
  );
};

// Define the props interface for the Sidebar component
interface SidebarProps {
  productId: string;
}

// Tell the Sidebar component to accept these props
const Sidebar = ({ productId }: SidebarProps) => {
  const [isNavSheetOpen, setIsNavSheetOpen] = useState(false);
  // --- FIX: Add state to track if the component is mounted on the client ---
  const [isClient, setIsClient] = useState(false);

  // --- FIX: Use useEffect to set isClient to true only on the client side ---
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="flex items-center justify-between w-full max-w-full px-4 py-2">
      {/**Sidebar */}
      <div className="flex-shrink-0">
        {/* --- FIX: Conditionally render the Sheet only on the client --- */}
        {isClient && (
          <Sheet open={isNavSheetOpen} onOpenChange={setIsNavSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Open Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>
                  <Link href="/" onClick={() => setIsNavSheetOpen(false)}>
                    <Image src="/logo/logo.svg" alt="Logo" width={150} height={35} />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="p-2 space-y-1">
                <Button asChild variant="ghost" className="w-full justify-start"><Link href="/" onClick={() => setIsNavSheetOpen(false)}>Home</Link></Button>
                <Button asChild variant="ghost" className="w-full justify-start"><Link href="/products" onClick={() => setIsNavSheetOpen(false)}>Products</Link></Button>
                <Button asChild variant="ghost" className="w-full justify-start"><Link href="/orders" onClick={() => setIsNavSheetOpen(false)}>Orders</Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      <div>
        {/* Pass the received prop down to AddToCart */}
        <AddToCart productId={productId} />
      </div> 
    </div>
  );
};

export default Sidebar;