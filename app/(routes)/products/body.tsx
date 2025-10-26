'use client';

import { useState, useEffect, ElementType, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowUp, Package, PackageSearch, Tag, Globe, LayoutGrid, MapPin, Shapes, Sparkles, HelpCircle, LucideIcon, ChevronDown } from "lucide-react";

import Footer from "@/app/components/common/footer";
import { Header } from "@/app/components/common/header";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import apiClient from "@/lib/apiClient";
import { Category, Product, Zone } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsByCriteria } from "@/app/components/hooks/get-products-by-criteria";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/components/contexts/language-context";
import { Collection, CollectionProduct } from "@/app/components/hooks/use-collections";
import CountdownTimer from "../home/count-down-timer";
// --- THE FIX: Import your existing CountdownTimer component ---

// Define the possible views locally
type ProductView = 'all' | 'category' | 'zone' | 'collection';

// --- VISUAL COMPONENTS (LOCALIZED WITHIN BODY.TSX) ---

// --- REMOVED: The local CountdownTimer component definition is no longer here. ---

// 1. Product Card
const ProductCard = ({ product }: { product: Product }) => (
  <Link 
    href={`/products/${product._id}`} 
    className="group block overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
  >
    <div className="relative h-48 w-full bg-muted/30">
      <Image src="/logo/logo.png" alt={product.name} fill className="object-contain p-6 transition-transform duration-300 group-hover:scale-110" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" />
    </div>
    <div className="p-4 border-t"><h3 className="truncate font-semibold text-card-foreground">{product.name}</h3><p className="text-sm text-muted-foreground">{product.brand || 'Generic'}</p></div>
  </Link>
);

// 2. Product Grid
const ProductGrid = ({ products }: { products: CollectionProduct[] }) => {
  if (!products || products.length === 0) return <p className='text-muted-foreground'>No products found in this collection.</p>;
  return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">{products.map(({ product }) => <ProductCard key={product._id} product={product} />)}</div>;
};

// 3. Icon Helper
const getIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return HelpCircle;
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[iconName];
  return IconComponent || HelpCircle;
};

// 4. Content Menu (Accepts endDate for the imported timer)
interface ContentMenuProps {
  language: "bn" | "en";
  id: string;
  title: string;
  iconName?: string;
  content?: React.ReactNode;
  productCount?: number;
  endDate?: string;
}
const ContentMenu = ({ language, id, title, iconName, content, productCount, endDate }: ContentMenuProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", amount: 0.3 });
  const Icon = getIcon(iconName);
  return (
    <motion.section ref={ref} id={id} className="w-full max-w-7xl mb-16" initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 20 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      <div className="w-full px-6 py-8 mx-auto rounded-2xl border bg-card/60 backdrop-blur-md shadow-lg">
        <h2 className="flex items-center text-3xl font-bold tracking-tight mb-2 gap-3 text-primary"><Icon className="h-8 w-8" />{title}</h2>
        {/* This now correctly uses your existing, imported CountdownTimer */}
        {endDate && <CountdownTimer endDate={endDate} />}
        <div className="mt-6">{content}</div>
        <motion.div className="flex justify-end mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          {productCount && productCount > 0 && (<Link href={`/products/collections/${id}`} className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground">{language === "bn" ? `সব ${productCount}+ পণ্য দেখুন` : `See All ${productCount}+ Products`}<ChevronDown className="w-4 h-4" /></Link>)}
        </motion.div>
      </div>
    </motion.section>
  );
};

// 5. Product Section (For Category and Zone)
interface ProductSectionProps {
  title: string;
  description?: string;
  Icon: ElementType;
  criteria: { type: 'category' | 'zone'; id: string; };
}
const ProductSection = ({ title, description, Icon, criteria }: ProductSectionProps) => {
  const { data: products, isLoading } = useProductsByCriteria(criteria);
  return (
    <section className="w-full max-w-7xl mb-16">
      <div className="mb-6"><h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground"><Icon className="h-7 w-7 text-primary" />{title}</h2>{description && <p className="mt-2 text-muted-foreground">{description}</p>}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">{isLoading && Array.from({ length: 5 }).map((_, i) => (<div key={i} className="rounded-lg border bg-card shadow-sm"><Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" /><div className="p-4 space-y-2 border-t"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>))}{products?.map(product => <ProductCard key={product._id} product={product} />)}</div>
      {!isLoading && products?.length === 0 && (<div className="col-span-full flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground bg-muted/50 rounded-lg"><PackageSearch className="h-12 w-12" /><p className="text-lg font-medium">No products found in this section yet.</p></div>)}
    </section>
  );
};

// --- THE MAIN BODY COMPONENT ---
const Body = () => {
  const { language } = useLanguage();
  const [showTopButton, setShowTopButton] = useState(false);
  const [view, setView] = useState<ProductView>('all');
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.products.getAllPublic(),
      apiClient.products.getCategories(),
      apiClient.products.getZones(),
      apiClient.collections.findAllPublic()
    ]).then(([productsRes, categoriesRes, zonesRes, collectionsRes]) => {
      setAllProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setZones(zonesRes.data);
      setCollections(collectionsRes.data);
    }).catch(err => {
      console.error("Failed to fetch initial data", err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const productsNavbar = (
    <div className="w-full flex justify-center px-4 bg-background border-b"><div className="w-full max-w-2xl flex justify-start items-center p-1 my-2 space-x-1 bg-muted rounded-full"><button onClick={() => setView('all')} className={cn("w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors", view === 'all' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}><LayoutGrid className="h-4 w-4" />All Products</button><button onClick={() => setView('category')} className={cn("w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors", view === 'category' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}><Shapes className="h-4 w-4" />By Category</button><button onClick={() => setView('zone')} className={cn("w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors", view === 'zone' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}><MapPin className="h-4 w-4" />By Zone</button><button onClick={() => setView('collection')} className={cn("w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors", view === 'collection' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}><Sparkles className="h-4 w-4" />Collections</button></div></div>
  );

  return ( 
    <BasicPageProvider header={<Header/>} footer={<Footer/>} navbar={productsNavbar} sidebar={null}>
      <main className="flex flex-col items-center justify-start py-8 px-4 bg-background text-foreground relative">
        <div className="w-full max-w-7xl mb-8 text-center"><h1 className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-extrabold tracking-tighter"><Package className="h-10 w-10" />Our Products</h1><p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Explore a wide range of quality products, perfectly organized for your convenience.</p></div>
        <div className="w-full">
          {isLoading && (<div className="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">{Array.from({ length: 10 }).map((_, i) => (<div key={i} className="rounded-lg border bg-card shadow-sm"><Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" /><div className="p-4 space-y-2 border-t"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>))}</div>)}
          {!isLoading && view === 'all' && (<div className="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">{allProducts?.map(product => <ProductCard key={product._id} product={product} />)}</div>)}
          {!isLoading && view === 'category' && categories?.map(category => (<ProductSection key={category._id} title={category.name} description={category.description} Icon={Tag} criteria={{ type: 'category', id: category._id }} />))}
          {!isLoading && view === 'zone' && zones?.map(zone => (<ProductSection key={zone._id} title={zone.name} description={zone.description} Icon={Globe} criteria={{ type: 'zone', id: zone._id }} />))}
          {!isLoading && view === 'collection' && collections?.map(collection => {
            const isLimitedTimeOffer = collection.url === 'limited-time-offer';
            return (
              <ContentMenu 
                key={collection._id} 
                language={language} 
                id={collection.url} 
                title={language === 'bn' ? collection.title_bn : collection.title} 
                iconName={collection.lucide_react_icon} 
                productCount={collection.products.length} 
                content={<ProductGrid products={collection.products} />} 
                endDate={isLimitedTimeOffer ? collection.end_date : undefined}
              />
            );
          })}
        </div>
        {showTopButton && (<button type="button" onClick={scrollToTop} aria-label="Scroll to top" className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg z-50 transition-all bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 active:scale-100"><ArrowUp className="w-6 h-6" /></button>)}
      </main>
    </BasicPageProvider>
  );
}
 
export default Body;