// FILE: @/app/components/forms/edit-product-form.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Category, Zone, Product } from "@/lib/types";
import { useUpdateProduct } from "../hooks/update-product";

// Form schema is similar, but images are optional as they may already exist.
const productFormSchema = z.object({
  name: z.string().trim().min(3, "Product name must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  zoneId: z.string().min(1, "Please select a zone"),
  minimumOrderQuantity: z.string().min(1, "Minimum order is required"),
  stockQuantity: z.string().min(1, "Stock is required"),
  unit: z.string().trim().min(1, "Unit is required"),
  pricingTiers: z.array(z.object({
    minQuantity: z.string().min(1, "Min quantity is required"),
    pricePerUnit: z.string().min(1, "Price is required"),
  })).min(1, "At least one pricing tier is required."),
});
type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductFormProps {
  initialData: Product;
}

export function EditProductForm({ initialData }: EditProductFormProps) {
  const router = useRouter();
  const { updateProduct, isLoading } = useUpdateProduct();
  const [categories, setCategories] = useState<Category[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  
  // State for managing images
  const [existingImages, setExistingImages] = useState<string[]>(initialData.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, zoneRes] = await Promise.all([
          apiClient.products.getCategories(),
          apiClient.products.getZones(),
        ]);
        setCategories(catRes.data);
        setZones(zoneRes.data);
      } catch (error) {
        toast.error("Failed to load categories/zones. Please refresh.");
      }
    };
    fetchData();

    // Cleanup for new image blob URLs
    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      categoryId: initialData.categoryId._id || "",
      zoneId: initialData.zoneId._id || "",
      minimumOrderQuantity: String(initialData.minimumOrderQuantity || 1),
      stockQuantity: String(initialData.stockQuantity || 0),
      unit: initialData.unit || "",
      pricingTiers: initialData.pricingTiers.map(tier => ({
          minQuantity: String(tier.minQuantity),
          pricePerUnit: String(tier.pricePerUnit),
      })) || [{ minQuantity: "1", pricePerUnit: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricingTiers",
  });

  const handleNewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewImageFiles(prev => [...prev, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...urls]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewImage = (index: number) => {
    const urlToRemove = newImagePreviews[index];
    URL.revokeObjectURL(urlToRemove);
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: ProductFormValues) {
    const formData = new FormData();

    // Append all standard fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'pricingTiers') {
        formData.append(key, value as string);
      }
    });

    // Append arrays as JSON strings
    formData.append('pricingTiers', JSON.stringify(data.pricingTiers.map(t => ({
        minQuantity: Number(t.minQuantity),
        pricePerUnit: Number(t.pricePerUnit),
    }))));
    formData.append('existingImages', JSON.stringify(existingImages));

    // Append new image files
    newImageFiles.forEach(file => {
      formData.append('images', file); // Backend expects 'images' field
    });
    
    toast.promise(updateProduct(initialData._id, formData), {
      loading: "Updating product...",
      success: (updatedProduct) => {
        router.push(`/products/${updatedProduct._id}`);
        router.refresh();
        return `Product "${updatedProduct.name}" updated successfully!`;
      },
      error: "Failed to update product. Please check your input.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        {/* ... (add all other form fields similar to your create form) */}
        
        {/* Image Management Section */}
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h3 className="text-lg font-medium">Manage Images</h3>
          {/* Existing Images */}
          <div>
            <FormLabel>Existing Images</FormLabel>
            {existingImages.length > 0 ? (
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {existingImages.map((src, index) => (
                  <div key={src} className="relative group aspect-square">
                    <Image src={src} alt={`Existing image ${index}`} fill sizes="20vw" className="object-cover rounded-md" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeExistingImage(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground mt-2">No existing images.</p>}
          </div>

          {/* New Images */}
          <div>
            <FormLabel htmlFor="new-images">Upload New Images</FormLabel>
            <FormControl>
              <Input id="new-images" type="file" multiple accept="image/*" onChange={handleNewImageChange} className="mt-2"/>
            </FormControl>
            {newImagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {newImagePreviews.map((src, index) => (
                   <div key={src} className="relative group aspect-square">
                    <Image src={src} alt={`New preview ${index}`} fill sizes="20vw" className="object-cover rounded-md" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeNewImage(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* ... (rest of your form fields for pricing, etc.) */}

        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}