"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Media } from "@/lib/types";

interface ProductImageGalleryProps {
    images?: Media[];
    productName: string;
}

export const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
    const imageUrls = images?.map(img => img.url) || [];
    const [selectedImage, setSelectedImage] = useState(imageUrls[0] || '/logo/logo.png');

    useEffect(() => {
        setSelectedImage(imageUrls[0] || '/logo/logo.png');
    }, [images]);

    const hasImages = imageUrls.length > 0;

    // Animation variants for the main image cross-fade (this part is fine)
    const mainImageVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    };

    return (
        // --- THE DEFINITIVE SOLUTION ---
        // 1. The problematic 'variants' object has been removed.
        // 2. Animation properties are now applied directly to the component.
        <motion.div 
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="aspect-square w-full relative overflow-hidden rounded-lg bg-transparent">
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

            {hasImages && imageUrls.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images?.map((mediaItem) => (
                        <motion.button
                            key={mediaItem._id}
                            onClick={() => setSelectedImage(mediaItem.url)}
                            className={cn(
                                "aspect-square relative rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                selectedImage === mediaItem.url ? "border-primary" : "border-transparent"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image src={mediaItem.url} alt={`${productName} thumbnail`} fill className="object-cover" />
                        </motion.button>
                    ))}
                </div>
            )}
        </motion.div>
    );
};