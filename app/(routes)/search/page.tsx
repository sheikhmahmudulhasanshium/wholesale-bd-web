// app/(routes)/search/page.tsx
"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import { Header } from '@/app/components/common/header';
import Footer from '@/app/components/common/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/app/components/contexts/language-context';
import { AlertTriangle, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/app/components/hooks/use-search';
import { ProductCard } from '@/app/components/common/product-card';

const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const query = searchParams.get('q');

  // Use the search hook
  const { data: searchResponse, isLoading, error } = useSearch({ query });

  const handleSuggestionClick = (suggestion: string) => {
    // Navigate to a new search page with the suggested query
    router.push(`/search?q=${encodeURIComponent(suggestion.replace('Did you mean: ', ''))}`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/2 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 p-8 border-dashed border-2 rounded-lg bg-card">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Error Fetching Results</h2>
        <p className="text-muted-foreground max-w-md">
          Something went wrong while trying to get your search results. Please try again later.
        </p>
      </div>
    );
  }
  
  // No Query State
  if (!query) {
      return (
          <div className="flex flex-col items-center justify-center text-center gap-4 p-8">
              <h2 className="text-2xl font-bold">Search for Products</h2>
              <p className="text-muted-foreground max-w-md">
                  Use the search bar in the header to find products by name, brand, or category.
              </p>
          </div>
      );
  }
  
  const hasResults = searchResponse && searchResponse.data.length > 0;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Search Results for &quot;{query}&quot;
      </h1>
      <p className="text-muted-foreground mb-6">
        {hasResults ? `Found ${searchResponse.total} products.` : 'No products found.'}
      </p>

      {/* "Did you mean..." Suggestion */}
      {searchResponse?.suggestion && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-4">
          <p className="text-blue-800">
            {searchResponse.suggestion.split(':')[0]}:
            <Button 
              variant="link"
              className="p-0 h-auto ml-1 text-blue-800 font-bold"
              onClick={() => handleSuggestionClick(searchResponse.suggestion || '')}
            >
              {searchResponse.suggestion.split(':')[1]}
            </Button>
          </p>
        </div>
      )}

      {/* Results Grid */}
      {hasResults ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {searchResponse.data.map(product => (
            <ProductCard key={product._id} product={product} language={language} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-4 p-8 border-dashed border-2 rounded-lg bg-card mt-8">
          <SearchX className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">No Results Found</h2>
          <p className="text-muted-foreground max-w-md">
            We couldn&apos;t find any products matching your search. Try a different keyword or check your spelling.
          </p>
        </div>
      )}

      {/* TODO: Add Pagination controls here if searchResponse.hasNextPage is true */}
    </div>
  );
};

// Use Suspense to handle client-side data fetching from URL params
const SearchPage = () => {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <Suspense fallback={<p>Loading search...</p>}>
          <SearchResults />
        </Suspense>
      </main>
    </BasicPageProvider>
  );
};

export default SearchPage;