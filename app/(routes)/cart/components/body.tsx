// @/app/(routes)/cart/components/body.tsx

"use client";

import { useMemo, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Frown, Search, X, MoreVertical, Trash2 } from 'lucide-react';

// Providers & Layout
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import { Header } from '@/app/components/common/header';
import Footer from '@/app/components/common/footer';
import { CartFilterSortProvider, useCart, useCartFilterSort, SortByOption, SortOrderOption, CartRefetchParams } from '@/app/components/contexts/cart-context';
import { useLanguage } from '@/app/components/contexts/language-context';
import { useAuth } from '@/app/components/contexts/auth-context';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { CartItemCard } from './cart-item-card';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryCard } from './summary';
import { ConfirmationDialog } from './confirmation-dialog';
import { AdminCartCard } from './admin-cart-card';

// Lib & Types
import { CartSearchResult, PaginatedAdminCartResponse, ProductDetails, Product } from '@/lib/types';
import apiClient from '@/lib/apiClient';
import Navbar from './navbar';
import Sidebar from './sidebar';

type ProductApiResponse = {
  data: Product;
} | null;

function getClientSideUnitPrice(tiers: { minQuantity: number; pricePerUnit: number }[], quantity: number): number {
  if (!tiers || tiers.length === 0) return 0;
  
  const sortedTiers = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);
  
  let activePrice = null;
  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (quantity >= sortedTiers[i].minQuantity) {
      activePrice = sortedTiers[i].pricePerUnit;
      break;
    }
  }
  return activePrice !== null ? activePrice : sortedTiers[0].pricePerUnit;
}

const CartView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { cartData, isLoading, refetchCartData, updateItemQuantity, removeItemFromCart, clearCart } = useCart();
  const { sortBy, sortOrder } = useCartFilterSort();

  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClearCartDialogOpen, setIsClearCartDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartSearchResult | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productDetails, setProductDetails] = useState<Record<string, ProductDetails>>({});

  useEffect(() => {
    const params = new URLSearchParams();
    if (sortBy !== (user?.role === 'admin' ? 'updatedAt' : 'productName')) params.set('filter', sortBy);
    if (sortOrder !== (user?.role === 'admin' ? 'desc' : 'asc')) params.set('order', sortOrder);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });

    const handler = setTimeout(() => {
      refetchCartData({ q: searchTerm, sortBy, sortOrder, page: currentPage });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, sortBy, sortOrder, currentPage, refetchCartData, pathname, router, user?.role]);

  useEffect(() => {
    if (user?.role !== 'admin' && cartData && Array.isArray(cartData)) {
      const fetchProductDetails = async () => {
        const userItems = cartData as CartSearchResult[];
        if (userItems.length === 0) return;
        const idsToFetch = userItems.map((item: CartSearchResult) => item.product._id).filter((id: string) => !productDetails[id]);
        if (idsToFetch.length === 0) return;
        try {
          const productPromises = idsToFetch.map((id: string) => apiClient.products.getByIdPublic(id).catch(() => null));
          const productResults = await Promise.all(productPromises);
          const newDetails: Record<string, ProductDetails> = {};
          
          productResults.forEach((result: ProductApiResponse) => {
            if (result && result.data) {
              // --- V FIX: Added the missing 'regularUnitPrice' property ---
              newDetails[result.data._id] = {
                thumbnailUrl: result.data.thumbnail?.url || null,
                minimumOrderQuantity: result.data.minimumOrderQuantity || 1,
                pricingTiers: result.data.pricingTiers || [],
                regularUnitPrice: result.data.regularUnitPrice,
              };
              // --- ^ END of FIX ---
            }
          });
          setProductDetails(prev => ({ ...prev, ...newDetails }));
        } catch (error) {
          console.error("Failed to batch fetch product details:", error);
        }
      };
      fetchProductDetails();
    }
  }, [cartData, user?.role, productDetails]);

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('postReloadRedirect');
    if (redirectPath) {
      sessionStorage.removeItem('postReloadRedirect');
      router.push(redirectPath);
    }
  }, [router]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currencyFormatter = useMemo(() => new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', { style: 'currency', currency: 'BDT' }), [language]);
  const t = useMemo(() => ({
    shoppingCart: 'Shopping Cart', yourItems: 'Your Items', summary: 'Summary', total: 'Total', items: 'items',
    submitForApproval: 'Submit for Approval', clearCart: 'Clear Cart', cartIsEmpty: 'Your Cart is Empty',
    continueShopping: 'Continue Shopping', orderSuccess: 'Order created successfully!',
    orderSuccessDesc: 'Your request has been sent for approval.', searchPlaceholder: 'Search...',
    noResults: 'No results found', priceWarning: "Final price may vary. Our team will contact you soon for confirmation.",
    allUserCarts: 'All User Carts',
  }), [language]);

  const userItems = useMemo(() => (Array.isArray(cartData) ? cartData : []) as CartSearchResult[], [cartData]);

  const { clientSidePrices, clientSideSummary } = useMemo(() => {
    const prices: Record<string, number> = {};
    const summary = { totalQuantity: 0, grandTotal: 0 };
    
    if (!userItems) return { clientSidePrices: prices, clientSideSummary: summary };

    userItems.forEach(item => {
      const details = productDetails[item.product._id];
      let itemTotal = 0;
      if (details) {
        const unitPrice = getClientSideUnitPrice(details.pricingTiers, item.quantity);
        itemTotal = unitPrice * item.quantity;
      } else {
        itemTotal = item.pricing.itemTotal;
      }
      prices[item.product._id] = itemTotal;
      summary.totalQuantity += item.quantity;
      summary.grandTotal += itemTotal;
    });

    return { clientSidePrices: prices, clientSideSummary: summary };
  }, [userItems, productDetails]);
  
  const cartHasWarnings = useMemo(() => {
    return userItems.some(item => {
      const details = productDetails[item.product._id];
      if (details && item.quantity < details.minimumOrderQuantity) {
        return true;
      }
      return item.warnings.length > 0;
    });
  }, [userItems, productDetails]);

  const handleCreateOrder = async () => {
    setIsSubmittingOrder(true);
    try {
      await apiClient.orders.createFromCart();
      toast.success(t.orderSuccess, { description: t.orderSuccessDesc });
      sessionStorage.setItem('postReloadRedirect', '/orders');
      window.location.reload();
    } catch (error) {
      setIsSubmittingOrder(false);
    }
  };

  const currentRefetchParams: CartRefetchParams = { q: searchTerm, sortBy, sortOrder, page: currentPage };

  const handleConfirmRemoveItem = async () => {
    if (!itemToRemove) return;
    setIsDeleting(true);
    await removeItemFromCart(itemToRemove.product._id, currentRefetchParams);
    setIsDeleting(false);
    setItemToRemove(null);
  };

  const handleConfirmClearCart = async () => {
    setIsDeleting(true);
    await clearCart(currentRefetchParams);
    setIsDeleting(false);
    setIsClearCartDialogOpen(false);
  };

  if (isLoading) {
    return <div className="container mx-auto p-8 text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto" /></div>;
  }
  
  if (user?.role === 'admin') {
    const adminData = cartData as PaginatedAdminCartResponse | null;
    const adminCarts = adminData?.data || [];
    const totalPages = adminData?.totalPages || 1;

    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col items-center gap-6 mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{t.allUserCarts}</h1>
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input 
              placeholder="Search by user name or email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="h-14 w-full rounded-full bg-background/80 pl-14 pr-12 text-base shadow-lg" 
            />
            {searchTerm && <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full" onClick={() => setSearchTerm('')}><X className="h-5 w-5" /></Button>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminCarts.length > 0 ? (
            adminCarts.map(cart => (
              <AdminCartCard key={cart._id} cart={cart} currencyFormatter={currencyFormatter} />
            ))
          ) : (
            <Card className="col-span-full"><CardContent className="p-8 text-center text-muted-foreground">No carts found.</CardContent></Card>
          )}
        </div>
        
        {totalPages > 1 && (
            <div className="flex items-center justify-center w-full gap-4 mt-8">
              <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} variant="outline">Previous</Button>
              <span className="text-sm font-medium text-muted-foreground">Page {currentPage} of {totalPages}</span>
              <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} variant="outline">Next</Button>
            </div>
        )}
      </div>
    );
  }
  
  if (userItems.length === 0 && !searchTerm) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col items-center gap-6 mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">{t.shoppingCart}</h1>
        </div>
        <Card className="text-center py-16">
          <CardHeader><Frown className="mx-auto h-16 w-16 text-muted-foreground" /><CardTitle className="mt-4 text-2xl">{t.cartIsEmpty}</CardTitle></CardHeader>
          <CardContent><Button asChild><Link href="/products">{t.continueShopping}</Link></Button></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">{t.shoppingCart}</h1>
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-14 w-full rounded-full bg-background/80 pl-14 pr-12 text-base shadow-lg" />
            {searchTerm && <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full" onClick={() => setSearchTerm('')}><X className="h-5 w-5" /></Button>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-semibold tracking-tight">{t.yourItems}</h2>
              {userItems.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-5 w-5 text-muted-foreground" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setIsClearCartDialogOpen(true)}><Trash2 className="mr-2 h-4 w-4" /><span>{t.clearCart}</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            {userItems.length > 0 ? (
              userItems.map((item: CartSearchResult) => (
                <Card key={item.product._id} className="shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <CartItemCard
                    item={item}
                    currencyFormatter={currencyFormatter}
                    details={productDetails[item.product._id]}
                    hasWarning={(productDetails[item.product._id] && item.quantity < productDetails[item.product._id].minimumOrderQuantity) || item.warnings.length > 0}
                    clientSideItemTotal={clientSidePrices[item.product._id] ?? 0}
                    onTriggerRemove={() => setItemToRemove(item)}
                    onUpdateQuantity={(newQuantity) => updateItemQuantity(item.product._id, newQuantity, currentRefetchParams)}
                  />
                </Card>
              ))
            ) : (
              <Card className="flex items-center justify-center p-8 shadow-sm"><p className="text-center text-muted-foreground">{`${t.noResults} for "${searchTerm}"`}</p></Card>
            )}
          </div>

          {userItems.length > 0 && (
            <div className="lg:col-span-1">
              <SummaryCard
                cartItems={userItems}
                summary={clientSideSummary}
                isProcessing={isSubmittingOrder}
                onCreateOrder={handleCreateOrder}
                currencyFormatter={currencyFormatter}
                translations={{
                  summary: t.summary, total: t.total, items: t.items,
                  submitForApproval: t.submitForApproval, priceWarning: t.priceWarning,
                }}
                hasWarnings={cartHasWarnings}
                clientSidePrices={clientSidePrices}
              />
            </div>
          )}
        </div>
      </div>
      
      <ConfirmationDialog
        open={!!itemToRemove}
        onOpenChange={(open) => !open && setItemToRemove(null)}
        onConfirm={handleConfirmRemoveItem}
        title="Remove Item?"
        description={`Are you sure you want to remove "${itemToRemove?.product.name}" from your cart?`}
        isConfirming={isDeleting}
      />
      <ConfirmationDialog
        open={isClearCartDialogOpen}
        onOpenChange={setIsClearCartDialogOpen}
        onConfirm={handleConfirmClearCart}
        title="Clear Entire Cart?"
        description="Are you sure you want to remove all items from your shopping cart? This action cannot be undone."
        isConfirming={isDeleting}
      />
    </>
  );
};

const CartPageLoader = () => {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  const orderParam = searchParams.get('order');
  const { user } = useAuth();

  const isValidSortBy = (param: string | null): param is SortByOption => !!param && ['productName', 'price', 'sellerName', 'warnings', 'updatedAt', 'totalValue', 'status', 'createdAt'].includes(param);
  const isValidSortOrder = (param: string | null): param is SortOrderOption => param === 'asc' || param === 'desc';

  const initialSortBy = isValidSortBy(filterParam) ? filterParam : (user?.role === 'admin' ? 'updatedAt' : 'productName');
  const initialSortOrder = isValidSortOrder(orderParam) ? orderParam : (user?.role === 'admin' ? 'desc' : 'asc');

  return (
    <CartFilterSortProvider 
      initialSortBy={initialSortBy} 
      initialSortOrder={initialSortOrder}
    >
      <BasicPageProvider header={<Header />} footer={<Footer />} navbar={<Navbar/>} sidebar={<Sidebar/>}>
        <CartView />
      </BasicPageProvider>
    </CartFilterSortProvider>
  );
};

export default function CartBody() {
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (!isMounted || isAuthLoading || !isAuthenticated) {
    return (
      <BasicPageProvider header={<Header />} footer={<Footer />}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="flex flex-col items-center gap-6 mb-12"><Skeleton className="h-10 w-64" /><Skeleton className="h-14 w-full max-w-lg rounded-full" /></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div><div className="lg:col-span-1"><Skeleton className="h-80 w-full" /></div></div>
        </div>
      </BasicPageProvider>
    );
  }

  return (
    <Suspense fallback={<div className="container mx-auto p-8 text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto" /></div>}>
      <CartPageLoader />
    </Suspense>
  );
}