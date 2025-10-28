// app/(routes)/products/body.tsx

'use client';

import { useState, useEffect, ElementType, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowUp, Package, PackageSearch, Tag, Globe, LayoutGrid, MapPin, Shapes, Sparkles, HelpCircle, LucideIcon, ChevronDown, Menu, ListIcon, Radar, BoxesIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import Footer from "@/app/components/common/footer";
import { Header } from "@/app/components/common/header";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import apiClient from "@/lib/apiClient";
import { Category, Product, Zone, Collection, CollectionProduct } from "@/lib/types";
import { useProductsByCriteria } from "@/app/components/hooks/get-products-by-criteria";
import { useLanguage } from "@/app/components/contexts/language-context";
import CountdownTimer from "@/app/(routes)/home/count-down-timer";
import { ProductCard } from "@/app/components/common/product-card"; // <-- 1. IMPORT THE CORRECT COMPONENT

type ProductView = 'all' | 'category' | 'zone' | 'collection';

const slugify = (prefix: string, text: string) => `${prefix}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;

// --- 2. REMOVE THE OUTDATED LOCAL ProductCard COMPONENT ---
// const ProductCard = ({ product }: { product: Product }) => ( ... ); // This entire block is removed.

const ProductGrid = ({ products }: { products: CollectionProduct[] }) => {
  const { language } = useLanguage(); // Get language context for the card
  if (!products || products.length === 0) return <p className='text-muted-foreground'>No products found in this collection.</p>;
  return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{products.map(({ product }) => <ProductCard key={product._id} product={product} language={language} />)}</div>;
};

const getIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return HelpCircle;
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[iconName];
  return IconComponent || HelpCircle;
};

const ContentMenu = ({ id, title, language, iconName, content, productCount, endDate }: { id: string; title: string; language: "bn" | "en"; iconName?: string; content?: React.ReactNode; productCount?: number; endDate?: string; }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", amount: 0.3 });
  const Icon = getIcon(iconName);
  return (
    <motion.section ref={ref} id={slugify('collection', id)} className="w-full max-w-7xl mb-12" initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 20 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      <div className="w-full px-4 sm:px-6 py-8 mx-auto rounded-2xl border bg-card/60 backdrop-blur-md shadow-lg">
        <h2 className="flex items-center text-2xl md:text-3xl font-bold tracking-tight mb-2 gap-3 text-primary"><Icon className="h-7 w-7 md:h-8 md:w-8" />{title}</h2>
        {endDate && <CountdownTimer endDate={endDate} />}
        <div className="mt-6">{content}</div>
        {productCount && productCount > 0 && (
          <motion.div className="flex justify-end mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href={`/products/collections/${id}`} className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground">
              {language === "bn" ? `সব ${productCount}+ পণ্য দেখুন` : `See All ${productCount}+ Products`}
              <ChevronDown className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

const ProductSection = ({ id, title, description, Icon, criteria }: { id: string; title: string; description?: string; Icon: ElementType; criteria: { type: 'category' | 'zone'; id: string; }; }) => {
  const { data: products, isLoading } = useProductsByCriteria(criteria);
  const { language } = useLanguage(); // Get language context for the card
  return (
    <section id={id} className="w-full max-w-7xl mb-12">
      <div className="mb-6"><h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold tracking-tight text-foreground"><Icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />{title}</h2>{description && <p className="mt-2 text-muted-foreground">{description}</p>}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading && Array.from({ length: 5 }).map((_, i) => (<div key={i} className="rounded-lg border bg-card shadow-sm"><Skeleton className="h-40 sm:h-48 w-full rounded-t-lg rounded-b-none" /><div className="p-3 sm:p-4 space-y-2 border-t"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>))}
        {products?.map(product => <ProductCard key={product._id} product={product} language={language} />)}
      </div>
      {!isLoading && products?.length === 0 && (<div className="col-span-full flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground bg-muted/50 rounded-lg"><PackageSearch className="h-12 w-12" /><p className="text-lg font-medium">No products found in this section yet.</p></div>)}
    </section>
  );
};

const Body = () => {
  const { language } = useLanguage();
  const [showTopButton, setShowTopButton] = useState(false);
  const [view, setView] = useState<ProductView>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    }).catch(err => console.error("Failed to fetch initial data", err)).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  
  const productsNavbar = (
    <div className="sticky top-[56px] md:top-[60px] z-30 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full max-w-2xl mx-auto flex justify-start sm:justify-center items-center p-1 my-2 space-x-2">
          {[
            { key: 'all', label: 'All', icon: LayoutGrid },
            { key: 'category', label: 'Categories', icon: Shapes },
            { key: 'zone', label: 'Zones', icon: MapPin },
            { key: 'collection', label: 'Collections', icon: Sparkles }
          ].map(item => (
            <Button
              key={item.key}
              variant="ghost"
              onClick={() => setView(item.key as ProductView)}
              className={cn(
                "flex-shrink-0 justify-center gap-2 px-4 h-10 rounded-full font-semibold transition-colors whitespace-nowrap",
                view === item.key
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
  
  const productsSidebar = (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon"><Menu className="h-6 w-6" /><span className="sr-only">Open Page Navigation</span></Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
            <SheetTitle><Image src={'/logo/logo.svg'} alt="Menu" height={100} width={200}/></SheetTitle>
        </SheetHeader>
        <SheetDescription className="pl-4">Select Menu</SheetDescription>
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
          <div>
            <div className="px-3 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center-safe gap-2"><ListIcon className="h-6 w-6"/> <h3 className="text-base">Categories</h3></div>
            {isLoading ? <Skeleton className="h-32 w-full" /> : categories?.map((cat) => (
              <Link key={cat._id} href={`#${slugify('category', cat.name)}`} onClick={() => { setView('category'); setIsSidebarOpen(false); }} className="block">
                <Button variant="ghost" className="w-full justify-start text-base gap-3 h-12"><Tag className="h-5 w-5 text-muted-foreground"/>{cat.name}</Button>
              </Link>
            ))}
          </div>
          <div>
            <div className="px-3 pt-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-t flex items-center-safe gap-2"><Radar className="h-6 w-6"/><h3 className="text-base">Zones</h3></div>
            {isLoading ? <Skeleton className="h-24 w-full" /> : zones?.map((zone) => (
              <Link key={zone._id} href={`#${slugify('zone', zone.name)}`} onClick={() => { setView('zone'); setIsSidebarOpen(false); }} className="block">
                <Button variant="ghost" className="w-full justify-start text-base gap-3 h-12"><Globe className="h-5 w-5 text-muted-foreground"/>{zone.name}</Button>
              </Link>
            ))}
          </div>
          <div>
            <div className="px-3 pt-2 pb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-t flex items-center gap-2"><BoxesIcon className="h-6 w-6"/><h3 className="text-base">Collections</h3></div>
            {isLoading ? <Skeleton className="h-24 w-full" /> : collections?.map((collection) => (
              <Link key={collection._id} href={`#${slugify('collection', collection.url)}`} onClick={() => { setView('collection'); setIsSidebarOpen(false); }} className="block">
                <Button variant="ghost" className="w-full justify-start text-base gap-3 h-12"><Sparkles className="h-5 w-5 text-muted-foreground"/>{language === 'bn' ? collection.title_bn : collection.title}</Button>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return ( 
    <BasicPageProvider header={<Header/>} footer={<Footer/>} navbar={productsNavbar} sidebar={isMounted ? productsSidebar : null}>
      <main className="flex flex-col items-center justify-start py-6 sm:py-8 px-4 bg-background text-foreground relative">
        <div className="w-full max-w-7xl mb-8 text-center"><h1 className="flex items-center justify-center gap-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter"><Package className="h-8 sm:h-10 w-8 sm:w-10" />Our Products</h1><p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm sm:text-base">Explore a wide range of quality products, perfectly organized for your convenience.</p></div>
        <div className="w-full">
          {isLoading && (<div className="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{Array.from({ length: 10 }).map((_, i) => (<div key={i} className="rounded-lg border bg-card shadow-sm"><Skeleton className="h-40 sm:h-48 w-full rounded-t-lg rounded-b-none" /><div className="p-3 sm:p-4 space-y-2 border-t"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>))}</div>)}
          
          {/* --- 3. PASS language PROP TO ProductCard --- */}
          {!isLoading && view === 'all' && (<div className="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{allProducts?.map(product => <ProductCard key={product._id} product={product} language={language} />)}</div>)}
          
          {!isLoading && view === 'category' && categories?.map(category => (<ProductSection key={category._id} id={slugify('category', category.name)} title={category.name} description={category.description} Icon={Tag} criteria={{ type: 'category', id: category._id }} />))}
          {!isLoading && view === 'zone' && zones?.map(zone => (<ProductSection key={zone._id} id={slugify('zone', zone.name)} title={zone.name} description={zone.description} Icon={Globe} criteria={{ type: 'zone', id: zone._id }} />))}
          {!isLoading && view === 'collection' && collections?.map(collection => (<ContentMenu key={collection._id} id={collection.url} language={language} title={language === 'bn' ? collection.title_bn : collection.title} iconName={collection.lucide_react_icon} productCount={collection.products.length} content={<ProductGrid products={collection.products} />} endDate={collection.url === 'limited-time-offer' ? collection.end_date : undefined}/>))}
        </div>
        {showTopButton && (<button type="button" onClick={scrollToTop} aria-label="Scroll to top" className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-3 rounded-full shadow-lg z-50 transition-all bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 active:scale-100"><ArrowUp className="w-6 h-6" /></button>)}
      </main>
    </BasicPageProvider>
  );
}
 
export default Body;