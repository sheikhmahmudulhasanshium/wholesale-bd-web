// app/(routes)/products/[id]/components/ProductImageGallery.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProductMedia } from "@/lib/types";

interface ProductImageGalleryProps {
    allMedia: ProductMedia[]; 
    productName: string;
}

// This helper function removes any query parameters from a URL.
const cleanUrl = (url: string) => {
  try {
    const urlObject = new URL(url);
    return `${urlObject.origin}${urlObject.pathname}`;
  } catch (error) {
    // If it's not a valid URL (e.g., a local path like '/logo/png'), return it as is.
    return url;
  }
};

export const ProductImageGallery = ({ allMedia, productName }: ProductImageGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState(cleanUrl(allMedia[0]?.url || '/logo/logo.png'));

    // This effect correctly handles component updates, including when media
    // is loaded asynchronously from the fallback endpoint.
    useEffect(() => {
        setSelectedImage(cleanUrl(allMedia[0]?.url || '/logo/logo.png'));
    }, [allMedia]);

    const hasImages = allMedia.length > 0;

    const mainImageVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    };

    return (
        <motion.div 
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="aspect-square w-full relative overflow-hidden rounded-lg bg-transparent border">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        variants={mainImageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="h-full w-full"
                    >
                        <Image
                            src={selectedImage}
                            alt={productName}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {hasImages && allMedia.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {allMedia.map((mediaItem) => (
                        <motion.button
                            key={mediaItem._id}
                            onClick={() => setSelectedImage(cleanUrl(mediaItem.url))}
                            className={cn(
                                "aspect-square relative rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                selectedImage === cleanUrl(mediaItem.url) ? "border-primary" : "border-transparent"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image 
                              src={cleanUrl(mediaItem.url)} 
                              alt={`${productName} thumbnail`} 
                              fill 
                              className="object-cover" 
                              sizes="(max-width: 640px) 20vw, 10vw"
                            />
                        </motion.button>
                    ))}
                </div>
            )}
        </motion.div>
    );
};