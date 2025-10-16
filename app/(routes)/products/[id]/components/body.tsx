'use client'; 
import { useProduct } from '@/app/components/hooks/get-product'; 
import { ScrollText, MapPin, DollarSign, Box, Package, Truck } from 'lucide-react'; 
import SlideShow from './slideshow'; 
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider'; 
import Footer from '@/app/components/common/footer'; 
import { Header } from '@/app/components/common/header'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { motion } from 'framer-motion'; 
import { useEffect, useState } from 'react'; 
import { PricingTier } from '@/lib/types';
import Navbar from './navbar';
import Sidebar from './sidebar';

interface TierCardProps { 
  minQuantity: number; 
  maxQuantity: number; 
  pricePerUnit: number; // Updated to reflect the type from the PricingTier
}

const TierCard: React.FC<TierCardProps> = ({ minQuantity, maxQuantity, pricePerUnit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6 flex items-center justify-between space-x-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex-1">
        <p className="font-semibold text-gray-800 dark:text-gray-200">
          {minQuantity} - {maxQuantity || '∞'} units
        </p>
        <p className="text-2xl font-bold text-cyan-500">BDT {pricePerUnit}</p>
      </div>
      <div className="w-px bg-gray-400 h-full mx-4"></div>
      <div className="flex-shrink-0">
        <span className="text-xs text-pink-500">Price per unit</span>
      </div>
    </motion.div>
  );
};

const Body: React.FC<{ id: string }> = ({ id }) => { 
  const { data: product, isLoading, error } = useProduct(id); 
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down'); 
  const [quantity, setQuantity] = useState<number>(1); 
  const [cart, setCart] = useState<any[]>([]); 

  const handleAddToCart = () => { 
    const newItem = { 
      productId: product?._id, 
      name: product?.name, 
      price: product?.pricingTiers[0].pricePerUnit, 
      quantity: quantity, 
    }; 
    setCart([...cart, newItem]); 
    console.log('Item added to cart', newItem); 
  };

  useEffect(() => { 
    let lastScrollY = window.scrollY; 
    const handleScroll = () => { 
      if (window.scrollY > lastScrollY) { 
        setScrollDirection('down'); 
      } else { 
        setScrollDirection('up'); 
      } 
      lastScrollY = window.scrollY; 
    }; 
    window.addEventListener('scroll', handleScroll); 
    return () => window.removeEventListener('scroll', handleScroll); 
  }, []);

  if (isLoading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error.message}</div>; 
  if (!product) return <div>Product not found</div>;

  return (
    <BasicPageProvider header={<Header />} footer={<Footer />} navbar={<Navbar/>} sidebar={<Sidebar/>}>
      <main className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {product.images && product.images.length > 0 && <SlideShow images={product.images} />}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-gray-900 dark:text-white pt-8"
          >
            {product.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-lg text-gray-700 dark:text-gray-300"
          >
            {product.description}
          </motion.p>
          <div className="mt-8 bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="font-semibold text-cyan-500"
            >
              Product Information
            </motion.h3>
            <p className="text-gray-900 dark:text-gray-100">SKU: {product.sku}</p>
            <p className="text-gray-900 dark:text-gray-100">Weight: {product.weight} kg</p>
            <p className="text-gray-900 dark:text-gray-100">Dimensions: {product.dimensions}</p>
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-gray-300 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="font-semibold text-cyan-500 flex gap-2 items-center">
                  <ScrollText /> Category:
                </h3>
                <p>{product.categoryId.name}</p>
                <p className="text-sm text-pink-500">{product.categoryId.description}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-gray-300 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="font-semibold text-cyan-500 flex gap-2 items-center">
                  <MapPin /> Zone:
                </h3>
                <p>{product.zoneId.name}</p>
                <p className="text-sm text-pink-500">{product.zoneId.description}</p>
              </motion.div>
            </div>
          </div>
          <div className="mt-8 bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="font-semibold text-gray-900 dark:text-gray-100"
            >
              Pricing & Stock
            </motion.h3>
            <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
              {product.pricingTiers.map((tier: PricingTier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-gray-300 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {tier.minQuantity} - {tier.maxQuantity || product.stockQuantity} units
                      </p>
                      <p className="text-2xl font-bold text-cyan-500">BDT {tier.pricePerUnit}</p>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-12 h-12 mr-2" />
                      <span className="text-xs text-pink-500">Price per unit</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-gray-900 dark:text-gray-100">
              Minimum Order Quantity: {product.minimumOrderQuantity}
            </p>
            <p className="text-gray-900 dark:text-gray-100">Stock Quantity: {product.stockQuantity}</p>
          </div>

          {/* Add to Cart - Separate Card, More Prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-blue-500 dark:bg-blue-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Add to Cart</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Quantity: {quantity}</p>
                  <p className="text-xl font-semibold">Price: BDT {product.pricingTiers[0].pricePerUnit * quantity}</p>
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleAddToCart}
                    className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Add {quantity} to Cart
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="mt-8 bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="font-semibold text-cyan-500"
            >
              Specifications
            </motion.h3>
            <p className="text-gray-900 dark:text-gray-100">{product.specifications}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-cyan-500 text-2xl">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {product.sellerId.firstName} {product.sellerId.lastName}
                </p>
                <p>Email: {product.sellerId.email}</p>
                <p>Business Name: {product.sellerId.businessName}</p>
                <p>Phone: {product.sellerId.phone}</p>
                <p>Zone: {product.sellerId.zone}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </BasicPageProvider>
  );
};

export default Body;
