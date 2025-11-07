// @/app/(routes)/products/[id]/components/Sidebar.tsx

"use client"; // --- V NEW: Add "use client" as this component now uses a hook via CartButton ---

import { CartButton } from '@/app/components/common/buttons/cart-button';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { FilterIcon, MenuIcon } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="flex items-center justify-between w-full max-w-full px-4 py-2">
      {/* Left Sidebar: Menu Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="group inline-flex items-center justify-center p-3 m-2 rounded-full bg-primary text-accent hover:bg-secondary hover:scale-110 transition-all duration-300 ease-in-out shadow-lg transform">
            <MenuIcon className="m-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-2" />
            <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 transition-all duration-300 ease-in-out"></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          asChild
          className="w-full lg:w-1/3 md:w-1/2 sm:w-full mt-2 p-4 bg-accent"
        >
          {/* Wrap the contents in a div */}
          <div>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
            <DropdownMenuItem>Item 3</DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Spacer between left and right buttons */}
      <div className="flex-grow"></div>

      {/* --- V MODIFIED: Replace placeholder button with functional CartButton --- */}
      <CartButton />
      {/* --- ^ END of MODIFIED --- */}

      {/* Right Sidebar: Filter Button */}
      <Button className="group inline-flex items-center justify-center p-3 m-2 rounded-full bg-primary text-accent hover:bg-secondary hover:scale-110 transition-all duration-300 ease-in-out shadow-lg transform">
        <FilterIcon className="m-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-2" />
        <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 transition-all duration-300 ease-in-out"></span>
      </Button>
    </div>
  );
};

export default Sidebar;