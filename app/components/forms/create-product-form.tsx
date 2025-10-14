// FILE: app/components/forms/create-product-form.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash2, UploadCloud, X } from "lucide-react";
import { AxiosError } from "axios"; // ✅ ADDED: Import AxiosError for better error type checking

import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Category, Zone } from "@/lib/types";

const formPricingTierSchema = z.object({
  minQuantity: z.string().min(1, "Min quantity is required"),
  pricePerUnit: z.string().min(1, "Price is required"),
});

const productFormSchema = z.object({
  name: z.string().trim().min(3, "Product name must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  zoneId: z.string().min(1, "Please select a zone"),
  minimumOrderQuantity: z.string().min(1, "Minimum order is required"),
  stockQuantity: z.string().min(1, "Stock is required"),
  unit: z.string().trim().min(1, "Unit is required (e.g., piece, kg, liter)"),
  brand: z.string().optional(),
  model: z.string().optional(),
  sku: z.string().optional(),
  images: z.custom<FileList>().refine(files => files && files.length > 0, "At least one image is required."),
  pricingTiers: z.array(formPricingTierSchema).min(1, "At least one pricing tier is required."),
});

const outputProductSchema = productFormSchema.extend({
    minimumOrderQuantity: z.coerce.number(),
    stockQuantity: z.coerce.number(),
    pricingTiers: z.array(z.object({
        minQuantity: z.coerce.number(),
        pricePerUnit: z.coerce.number(),
    }))
});

type ProductFormValues = z.infer<typeof productFormSchema>;
type OutputProductValues = z.infer<typeof outputProductSchema>;

export function CreateProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null); // ✅ ADDED: State to handle and display form error

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
        toast.error("Failed to load necessary data. Please refresh the page.");
        console.log(error);
      }
    };
    fetchData();
  }, []); // This effect correctly runs only once on mount

  // This effect cleans up image preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]); // ✅ FIXED: Added missing dependency

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      minimumOrderQuantity: "1",
      stockQuantity: "0",
      unit: "",
      pricingTiers: [{ minQuantity: "1", pricePerUnit: "" }],
      brand: "",
      model: "",
      sku: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricingTiers",
  });
  
  const imageRef = form.register("images");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(urls);
    }
  };

  const removeImage = (index: number) => {
    const currentFiles = form.getValues("images");
    if (!currentFiles) return;
    const newFiles = new DataTransfer();
    Array.from(currentFiles).forEach((file, i) => {
      if (i !== index) {
        newFiles.items.add(file as File);
      }
    });
    form.setValue("images", newFiles.files, { shouldValidate: true });
    const urlToRemove = imagePreviews[index];
    URL.revokeObjectURL(urlToRemove);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);
    setFormError(null); // Reset error on new submission
    
    const coercedData: OutputProductValues = outputProductSchema.parse(data);
    const formData = new FormData();

    Object.entries(coercedData).forEach(([key, value]) => {
      if (key !== "images" && key !== "pricingTiers" && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    formData.append("pricingTiers", JSON.stringify(coercedData.pricingTiers));
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    }
    
    try {
        await apiClient.products.create(formData);
        toast.success("Product created successfully!");
        router.push("/dashboard");
        router.refresh();
    } catch (error) {
        // ✅ FIXED: Set and display a user-friendly error message
        if (error instanceof AxiosError && error.response?.data?.message) {
          const message = Array.isArray(error.response.data.message) 
            ? error.response.data.message.join(', ') 
            : error.response.data.message;
          setFormError(message);
        } else {
          setFormError("An unexpected error occurred. Please try again.");
        }
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ... (all your FormField sections remain the same) ... */}
        
        {/* Basic Information Section */}
        <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Samsung Galaxy S24 Ultra" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe the product's features, benefits, and specifications." rows={5} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </div>

        {/* Image Uploader Section */}
        <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-4">Product Images</h3>
            <FormField control={form.control} name="images" render={() => (
                <FormItem>
                    <FormControl>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-accent">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP or GIF (MAX. 5MB each)</p>
                                </div>
                                <Input id="image-upload" type="file" className="hidden" multiple accept="image/*" {...imageRef} onChange={handleImageChange} />
                            </label>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {imagePreviews.map((src, index) => (
                        <div key={src} className="relative group aspect-square">
                            <Image src={src} alt={`Preview ${index}`} fill sizes="20vw" className="object-cover rounded-md" />
                            <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Details & Categorization */}
        <div className="p-6 border rounded-lg bg-card">
             <h3 className="text-lg font-medium mb-4">Details & Categorization</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="zoneId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Zone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a sales zone" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {zones.map(zone => <SelectItem key={zone._id} value={zone._id}>{zone.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="brand" render={({ field }) => (<FormItem><FormLabel>Brand</FormLabel><FormControl><Input placeholder="e.g., Samsung" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., SM-S928B" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sku" render={({ field }) => (<FormItem><FormLabel>SKU</FormLabel><FormControl><Input placeholder="e.g., WBD-S24-101" {...field} /></FormControl><FormMessage /></FormItem>)} />
             </div>
        </div>

        {/* Pricing & Inventory */}
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
                    <div key={field.id} className="flex items-start gap-2 p-2 border rounded-md">
                        <FormField control={form.control} name={`pricingTiers.${index}.minQuantity`} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input type="number" placeholder="Min Qty" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`pricingTiers.${index}.pricePerUnit`} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input type="number" placeholder="Price / Unit" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" className="mt-1" onClick={() => remove(index)} disabled={fields.length <= 1}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ minQuantity: "1", pricePerUnit: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Tier
                </Button>
                <FormMessage>{form.formState.errors.pricingTiers?.root?.message}</FormMessage>
            </div>
        </div>
        
        {/* ✅ ADDED: Display form-level error message */}
        {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}

        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Product
            </Button>
        </div>
      </form>
    </Form>
  );
}