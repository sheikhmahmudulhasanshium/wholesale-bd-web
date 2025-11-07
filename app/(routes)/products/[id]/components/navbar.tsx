// @/app/(routes)/products/[id]/components/Navbar.tsx

"use client"; // --- V NEW: Add "use client" as this component now uses a hook via CartButton ---

import { CartButton } from '@/app/components/common/buttons/cart-button';
import { Button } from '@/components/ui/button';
import { LucideChevronLeft } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="shadow-accent shadow-2xl bg-accent flex flex-row items-center-safe justify-between">
      <Link href="/products" className="">
        <Button className="relative inline-flex items-center justify-center p-3 m-2 rounded-full bg-primary text-accent hover:bg-secondary hover:scale-110 transition-all duration-300 ease-in-out shadow-lg transform">
          <LucideChevronLeft className="m-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-2" />
          <span className="sr-only">Back to products</span>
        </Button>
      </Link>
      <p>Navbar elements</p>
      {/* --- V MODIFIED: Replace placeholder button with functional CartButton --- */}
      <CartButton />
      {/* --- ^ END of MODIFIED --- */}
    </div>
  );
};

export default Navbar;