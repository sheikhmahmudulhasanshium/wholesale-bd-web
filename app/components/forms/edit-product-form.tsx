"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash2, Link as LinkIcon } from "lucide-react";
import { AxiosError } from "axios";

import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, Category, Zone, ProductMedia } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// --- FIX 1: Add maxQuantity to the pricing tier schema ---
const productFormSchema = z.object({
  name: z.string().trim().min(3, "Product name must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  zoneId: z.string().min(1, "Please select a zone"),
  minimumOrderQuantity: z.string().min(1, "Minimum order is required"),
  stockQuantity: z.string().min(1, "Stock is required"),
  unit: z.string().trim().min(1, "Unit is required"),
  brand: z.string().optional(),
  model: z.string().optional(),
  sku: z.string().optional(),
  specifications: z.string().optional(),
  pricingTiers: z.array(z.object({
    minQuantity: z.string().min(1, "Min quantity is required"),
    maxQuantity: z.string().optional(),
    pricePerUnit: z.string().min(1, "Price is required"),
  })).min(1, "At least one pricing tier is required."),
});
type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductFormProps {
  initialData: Product;
}

interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export function EditProductForm({ initialData }: EditProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [currentMedia, setCurrentMedia] = useState<ProductMedia[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const getInitialMedia = (product: Product): ProductMedia[] => {
    const allMedia: ProductMedia[] = [];
    if (product.thumbnail) allMedia.push(product.thumbnail);
    if (product.previews) allMedia.push(...product.previews);
    if (allMedia.length === 0 && product.images && product.images.length > 0) {
      return product.images.map((url, index) => ({
        _id: `fallback-${index}-${url}`,
        url,
        purpose: index === 0 ? 'thumbnail' : 'preview',
        priority: index
      }));
    }
    return allMedia.sort((a,b) => a.priority - b.priority);
  };
  
  useEffect(() => {
    setCurrentMedia(getInitialMedia(initialData));
  }, [initialData]);

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
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      categoryId: initialData.categoryId || "",
      zoneId: initialData.zoneId || "",
      minimumOrderQuantity: String(initialData.minimumOrderQuantity || 1),
      stockQuantity: String(initialData.stockQuantity || 0),
      unit: initialData.unit || "",
      brand: initialData.brand || "",
      model: initialData.model || "",
      sku: initialData.sku || "",
      specifications: initialData.specifications || "",
      // --- FIX 2: Correctly map initial maxQuantity to form values ---
      pricingTiers: initialData.pricingTiers.map(tier => ({
          minQuantity: String(tier.minQuantity),
          maxQuantity: tier.maxQuantity ? String(tier.maxQuantity) : "",
          pricePerUnit: String(tier.pricePerUnit),
      })) || [{ minQuantity: "1", maxQuantity: "", pricePerUnit: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricingTiers",
  });

  const handleFileUpload = async (files: FileList | null, purpose: 'thumbnail' | 'preview') => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setIsMediaLoading(true);
    const promise = purpose === 'thumbnail'
        ? apiClient.products.uploadThumbnail(initialData._id, file)
        : apiClient.products.uploadPreview(initialData._id, file);

    toast.promise(promise, {
        loading: 'Uploading image...',
        success: (response) => {
            setCurrentMedia(getInitialMedia(response.data));
            return 'Image uploaded successfully!';
        },
        error: 'Failed to upload image.',
        finally: () => setIsMediaLoading(false),
    });
  };

  const handleAddFromUrl = async (url: string, purpose: 'thumbnail' | 'preview') => {
    if (!url.trim()) {
        toast.error("Please enter a valid URL.");
        return;
    }
    setIsMediaLoading(true);
    const promise = purpose === 'thumbnail'
        ? apiClient.products.setThumbnailFromUrl(initialData._id, url)
        : apiClient.products.addPreviewFromUrl(initialData._id, url);

    toast.promise(promise, {
        loading: 'Processing image from URL...',
        success: (response) => {
            setCurrentMedia(getInitialMedia(response.data));
            if (purpose === 'thumbnail') setThumbnailUrl("");
            else setPreviewUrl("");
            return 'Image added successfully from URL!';
        },
        error: (err: AxiosError<ApiErrorResponse>) => {
            const apiMessage = err.response?.data?.message || 'Please check the link and try again.';
            return `Failed to add image: ${apiMessage}`;
        },
        finally: () => setIsMediaLoading(false),
    });
  };
  
  const handleDeleteMedia = async (mediaId: string) => {
    if (mediaId.startsWith('fallback-')) {
        toast.info("This is a legacy image and cannot be deleted here. Please re-upload images to manage them.");
        return;
    }
    setIsMediaLoading(true);
    toast.promise(apiClient.products.deleteMedia(initialData._id, mediaId), {
        loading: 'Deleting image...',
        success: (response) => {
            setCurrentMedia(getInitialMedia(response.data));
            return 'Image deleted.';
        },
        error: 'Failed to delete image.',
        finally: () => setIsMediaLoading(false),
    });
  };

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    const updatePayload = {
      ...data,
      minimumOrderQuantity: Number(data.minimumOrderQuantity),
      stockQuantity: Number(data.stockQuantity),
      // --- FIX 3: Correctly map maxQuantity to the payload ---
      pricingTiers: data.pricingTiers.map(t => ({
        minQuantity: Number(t.minQuantity),
        maxQuantity: t.maxQuantity ? Number(t.maxQuantity) : undefined,
        pricePerUnit: Number(t.pricePerUnit)
      })),
    };

    toast.promise(apiClient.products.update(initialData._id, updatePayload), {
      loading: "Updating product details...",
      success: (response) => {
        router.refresh();
        return `Product "${response.data.name}" updated successfully!`;
      },
      error: "Failed to update product. Please check your input.",
      finally: () => setIsSubmitting(false),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Product Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Product Description</FormLabel> <FormControl><Textarea placeholder="Describe the product's features, benefits, and specifications." {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            </div>
        </div>
        
        <div className="p-6 border rounded-lg bg-card space-y-4">
            <h3 className="text-lg font-medium">Manage Images</h3>
            <div className="space-y-4">
                <FormLabel>Current Images</FormLabel>
                {currentMedia.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {currentMedia.map((media) => (
                      <div key={media._id} className="relative group aspect-square">
                        <Image src={media.url} alt={media.purpose} fill sizes="20vw" className="object-cover rounded-md border" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                            <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteMedia(media._id)} disabled={isMediaLoading}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Badge variant={media.purpose === 'thumbnail' ? 'default' : 'secondary'} className="absolute bottom-1 left-1 pointer-events-none">{media.purpose}</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No images uploaded yet.</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 pt-4 border-t">
                 <div className="space-y-3">
                    <FormLabel htmlFor="thumbnail-upload">Upload/Replace Thumbnail</FormLabel>
                    <Input id="thumbnail-upload" type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files, 'thumbnail')} disabled={isMediaLoading} />
                     <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or add from URL</span></div>
                    </div>
                    <div className="flex gap-2">
                         <Input id="thumbnail-url" type="url" placeholder="Paste image URL" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} disabled={isMediaLoading}/>
                         <Button type="button" size="icon" onClick={() => handleAddFromUrl(thumbnailUrl, 'thumbnail')} disabled={isMediaLoading}>
                            <LinkIcon className="h-4 w-4" />
                         </Button>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <FormLabel htmlFor="preview-upload">Upload a Preview Image</FormLabel>
                    <Input id="preview-upload" type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files, 'preview')} disabled={isMediaLoading} />
                     <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or add from URL</span></div>
                    </div>
                    <div className="flex gap-2">
                        <Input id="preview-url" type="url" placeholder="Paste image URL" value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} disabled={isMediaLoading}/>
                        <Button type="button" size="icon" onClick={() => handleAddFromUrl(previewUrl, 'preview')} disabled={isMediaLoading}>
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </div>
                 </div>
            </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
             <h3 className="text-lg font-medium mb-4">Details & Categorization</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="categoryId" render={({ field }) => ( <FormItem> <FormLabel>Category</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl> <SelectContent> {categories.map(cat => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="zoneId" render={({ field }) => ( <FormItem> <FormLabel>Zone</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a sales zone" /></SelectTrigger></FormControl> <SelectContent> {zones.map(zone => <SelectItem key={zone._id} value={zone._id}>{zone.name}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="brand" render={({ field }) => (<FormItem><FormLabel>Brand</FormLabel><FormControl><Input placeholder="e.g., Samsung" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., SM-S928B" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sku" render={({ field }) => (<FormItem><FormLabel>SKU</FormLabel><FormControl><Input placeholder="e.g., WBD-S24-101" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="specifications" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Extra Specifications</FormLabel><FormControl><Textarea placeholder="Add any additional details, one per line." {...field} /></FormControl><FormMessage /></FormItem>)} />
             </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-4">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormField control={form.control} name="stockQuantity" render={({ field }) => (<FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="minimumOrderQuantity" render={({ field }) => (<FormItem><FormLabel>Minimum Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="unit" render={({ field }) => (<FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g., Piece, Box, Kg" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormLabel>Pricing Tiers (for bulk discounts)</FormLabel>
            <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                    // --- FIX 4: Add maxQuantity input to the UI ---
                    <div key={field.id} className="grid grid-cols-3 items-start gap-2 p-2 border rounded-md relative pr-12">
                        <FormField control={form.control} name={`pricingTiers.${index}.minQuantity`} render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="Min Qty" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`pricingTiers.${index}.maxQuantity`} render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="Max Qty (optional)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`pricingTiers.${index}.pricePerUnit`} render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="Price / Unit" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => remove(index)} disabled={fields.length <= 1}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ minQuantity: "", maxQuantity: "", pricePerUnit: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Tier
                </Button>
            </div>
        </div>

        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || isMediaLoading}>
                {(isSubmitting || isMediaLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}