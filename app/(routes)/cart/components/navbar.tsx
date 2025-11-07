// @/app/(routes)/cart/components/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownAZ,
  ArrowUpZA,
  ListOrdered,
  MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartButton } from "@/app/components/common/buttons/cart-button";
import { useCartFilterSort, SortByOption, SortOrderOption } from "@/app/components/contexts/cart-context";
import { useAuth } from "@/app/components/contexts/auth-context";
import Image from "next/image";

const orderOptions: { value: SortOrderOption; label: string; icon: React.ReactNode }[] = [
    { value: 'asc', label: "Ascending", icon: <ArrowUpZA className="h-4 w-4" /> },
    { value: 'desc', label: "Descending", icon: <ArrowDownAZ className="h-4 w-4" /> },
];

const Navbar = () => {
    const [isNavSheetOpen, setIsNavSheetOpen] = useState(false);
    const { sortBy, setSortBy, sortOrder, setSortOrder } = useCartFilterSort();
    const { user } = useAuth();

    let sortOptions: { value: SortByOption; label: string }[];

    if (user?.role === 'admin') {
      sortOptions = [
        { value: 'updatedAt', label: "Last Updated" },
        { value: 'totalValue', label: "Total Value" },
        { value: 'status', label: "Status" },
        { value: 'createdAt', label: "Date Created" },
      ];
    } else {
      sortOptions = [
        { value: 'productName', label: "Product Name" },
        { value: 'price', label: "Price" },
        { value: 'sellerName', label: "Seller" },
        { value: 'warnings', label: "Warnings" },
      ];
    }

    return ( 
        <nav className="flex justify-between items-center w-full bg-background border-b px-4 h-14">
            <div className="flex-shrink-0">
              <Sheet open={isNavSheetOpen} onOpenChange={setIsNavSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
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
            </div>

            <div className="flex-grow flex justify-center items-center gap-2 overflow-x-auto mx-4">
                {sortOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant={sortBy === option.value ? "secondary" : "ghost"}
                        size="sm"
                        className="rounded-full h-8 px-4 flex-shrink-0"
                        onClick={() => setSortBy(option.value)}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>

            <div className="flex-shrink-0 flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ListOrdered className="h-5 w-5" />
                      <span className="sr-only">Order By</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Order</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrderOption)}>
                      {orderOptions.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value} className="gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <CartButton />
            </div>
        </nav>
     );
}
 
export default Navbar;