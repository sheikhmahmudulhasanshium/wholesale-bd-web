// @/app/(routes)/cart/components/sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownAZ,
  ArrowUpZA,
  FilterIcon,
  ListOrdered,
  MenuIcon,
  Tag,
  DollarSign,
  User,
  AlertCircle,
  Clock,
  CircleDollarSign,
  Activity,
  Calendar,
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

const Sidebar = () => {
  const [isNavSheetOpen, setIsNavSheetOpen] = useState(false);
  const { sortBy, setSortBy, sortOrder, setSortOrder } = useCartFilterSort();
  const { user } = useAuth();

  let sortOptions: { value: SortByOption; label: string; icon: React.ReactNode }[];

  if (user?.role === 'admin') {
    sortOptions = [
      { value: 'updatedAt', label: "Last Updated", icon: <Clock className="h-4 w-4" /> },
      { value: 'totalValue', label: "Total Value", icon: <CircleDollarSign className="h-4 w-4" /> },
      { value: 'status', label: "Status", icon: <Activity className="h-4 w-4" /> },
      { value: 'createdAt', label: "Date Created", icon: <Calendar className="h-4 w-4" /> },
    ];
  } else {
    sortOptions = [
      { value: 'productName', label: "Product Name", icon: <Tag className="h-4 w-4" /> },
      { value: 'price', label: "Price", icon: <DollarSign className="h-4 w-4" /> },
      { value: 'sellerName', label: "Seller Name", icon: <User className="h-4 w-4" /> },
      { value: 'warnings', label: "Has Warnings", icon: <AlertCircle className="h-4 w-4" /> },
    ];
  }

  return (
    <div className="flex justify-between items-center w-full mx-auto px-1">
      <div>
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

      <div className="flex items-center gap-1 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <FilterIcon className="h-5 w-5" />
              <span className="sr-only">Sort By</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as SortByOption)}>
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value} className="gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

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
    </div>
  );
};

export default Sidebar;