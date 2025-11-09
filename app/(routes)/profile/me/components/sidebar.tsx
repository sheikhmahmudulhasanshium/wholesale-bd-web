"use client";

import { CartButton } from '@/app/components/common/buttons/cart-button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { IdCardIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BecomeSeller from '@/app/components/common/buttons/become-a-seller-button';

export default function Sidebar() {
  const [isNavSheetOpen, setIsNavSheetOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  return (
    <div className="flex items-center justify-between w-full max-w-full px-4 py-2">
      <div className="flex-shrink-0">
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
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/" onClick={() => setIsNavSheetOpen(false)}>Home</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/products" onClick={() => setIsNavSheetOpen(false)}>Products</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/orders" onClick={() => setIsNavSheetOpen(false)}>Orders</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="flex items-center gap-3">
        <CartButton />

        {/* Button: Fixed width with subtle hover color switch */}
        <BecomeSeller/>
              </div>
    </div>
  );
}
