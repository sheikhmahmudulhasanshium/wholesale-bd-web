// @/app/components/contexts/cart-context.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
// FIX: Imported 'Product' type which is used in the other file. This isn't strictly necessary here but good practice.
import { Cart, CartSearchResult, PaginatedAdminCartResponse, Product } from '@/lib/types';
import apiClient from '@/lib/apiClient';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

export type SortByOption = 
  'productName' | 'price' | 'sellerName' | 'warnings' |
  'updatedAt' | 'totalValue' | 'status' | 'createdAt';

export type SortOrderOption = 'asc' | 'desc';

export type CartRefetchParams = {
  q?: string;
  sortBy?: SortByOption;
  sortOrder?: SortOrderOption;
  page?: number;
};

// ====================================================================
// SECTION 1: Cart Data Context
// ====================================================================

interface CartContextType {
  cartData: CartSearchResult[] | PaginatedAdminCartResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetchCartData: (params: CartRefetchParams) => Promise<void>;
  addItemToCart: (productId: string, quantity: number) => Promise<void>; 
  updateItemQuantity: (productId: string, quantity: number, refetchParams: CartRefetchParams) => Promise<void>;
  removeItemFromCart: (productId: string, refetchParams: CartRefetchParams) => Promise<void>;
  clearCart: (refetchParams: CartRefetchParams) => Promise<void>;
  cartSummary: Cart['summary'] | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [cartData, setCartData] = useState<CartSearchResult[] | PaginatedAdminCartResponse | null>(null);
  const [cartSummary, setCartSummary] = useState<Cart['summary'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const refetchCartData = useCallback(async (params: CartRefetchParams) => {
    if (!isAuthenticated || isUpdating) {
      if (!isAuthenticated) setIsLoading(false);
      return;
    };
    
    setIsLoading(true);
    setError(null);
    try {
      if (user?.role === 'admin') {
        const response = await apiClient.cart.search(params);
        setCartData(response.data as PaginatedAdminCartResponse);
        setCartSummary(null);
      } else {
        const [searchResponse, summaryResponse] = await Promise.all([
          apiClient.cart.search(params),
          apiClient.cart.get(),
        ]);
        const responseData = searchResponse.data;
        setCartData(Array.isArray(responseData) ? responseData : []);
        setCartSummary(summaryResponse.data.summary);
      }
    } catch (err) {
      setError(err as Error);
      setCartData(null);
      setCartSummary(null);
      console.error('Failed to fetch cart data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isUpdating, user?.role]);

  const performCartAction = async (action: () => Promise<unknown>, refetchParams?: CartRefetchParams) => {
    if (!isAuthenticated) return;
    setIsUpdating(true);
    try {
      await action();
      const defaultParams: CartRefetchParams = user?.role === 'admin' 
        ? { sortBy: 'updatedAt', sortOrder: 'desc', page: 1 }
        : { sortBy: 'productName', sortOrder: 'asc' };
      await refetchCartData(refetchParams || defaultParams);
    } catch (err) {
      console.error('Cart action failed:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const addItemToCart = async (productId: string, quantity: number) => {
    await performCartAction(() => {
        toast.success('Item added to cart!');
        return apiClient.cart.addItems([{ productId, quantity }]);
    });
  };

  const updateItemQuantity = async (productId: string, quantity: number, refetchParams: CartRefetchParams) => {
    await performCartAction(() => apiClient.cart.updateItems([{ productId, quantity }]), refetchParams);
  };

  const removeItemFromCart = async (productId: string, refetchParams: CartRefetchParams) => {
    await performCartAction(() => {
        toast.success('Item removed from cart.');
        return apiClient.cart.updateItems([{ productId, quantity: 0 }]);
    }, refetchParams);
  };

  const clearCart = async (refetchParams: CartRefetchParams) => {
    if (user?.role === 'admin') return;
    if (!cartSummary || cartSummary.totalUniqueItems === 0) return;
    const currentCartData = await apiClient.cart.get();
    const itemsToClear = currentCartData.data.itemsBySeller.flatMap(group =>
      group.items.map(item => ({ productId: item.product._id, quantity: 0 }))
    );

    if (itemsToClear.length > 0) {
      await performCartAction(() => {
          toast.success('Cart has been cleared.');
          return apiClient.cart.updateItems(itemsToClear);
      }, refetchParams);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      setIsLoading(false);
      setCartData(null);
      setCartSummary(null);
    }
  }, [isAuthenticated, isAuthLoading]);
  
  const value = {
    cartData, isLoading, error, refetchCartData, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart, cartSummary,
  };

  // FIX: Corrected the closing tag from </Cart.Provider> to </CartContext.Provider>
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// ====================================================================
// SECTION 2: Cart Filter & Sort Context
// ====================================================================

interface CartFilterSortContextType {
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  sortBy: SortByOption;
  setSortBy: (value: SortByOption) => void;
  sortOrder: SortOrderOption;
  setSortOrder: (value: SortOrderOption) => void;
}

const CartFilterSortContext = createContext<CartFilterSortContextType | undefined>(undefined);

interface CartFilterSortProviderProps {
  children: ReactNode;
  initialSortBy?: SortByOption;
  initialSortOrder?: SortOrderOption;
}

export function CartFilterSortProvider({ children, initialSortBy, initialSortOrder }: CartFilterSortProviderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortByOption>(initialSortBy || 'productName');
  const [sortOrder, setSortOrder] = useState<SortOrderOption>(initialSortOrder || 'asc');

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  const value = {
    isSheetOpen,
    openSheet,
    closeSheet,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };

  return (
    <CartFilterSortContext.Provider value={value}>
      {children}
    </CartFilterSortContext.Provider>
  );
}

export function useCartFilterSort() {
  const context = useContext(CartFilterSortContext);
  if (context === undefined) {
    throw new Error('useCartFilterSort must be used within a CartFilterSortProvider');
  }
  return context;
}