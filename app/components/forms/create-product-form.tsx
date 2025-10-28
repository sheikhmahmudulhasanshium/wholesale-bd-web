"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { AxiosError } from "axios";

import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Zone } from "@/lib/types";
import { useAuth } from "../contexts/auth-context";

// --- FIX 1: Add maxQuantity to the pricing tier schema ---
const formPricingTierSchema = z.object({
  minQuantity: z.string().min(1, "Min quantity is required"),
  maxQuantity: z.string().optional(), // maxQuantity is optional
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
  pricingTiers: z.array(formPricingTierSchema).min(1, "At least one pricing tier is required."),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function CreateProductForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, zoneRes] = await Promise.all([
          apiClient.products.getCategories(),
          apiClient.products.getZones(),
        ]);
        setCategories(catRes.data);
        setZones(zoneRes.data);
      } catch (_error) {
        toast.error("Failed to load necessary data. Please refresh the page.");
      }
    };
    fetchData();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      minimumOrderQuantity: "1",
      stockQuantity: "0",
      unit: "",
      // --- FIX 2: Include maxQuantity in default values ---
      pricingTiers: [{ minQuantity: "1", maxQuantity: "", pricePerUnit: "" }],
      brand: "",
      model: "",
      sku: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricingTiers",
  });
  
  async function onSubmit(data: ProductFormValues) {
    if (!user) {
        setFormError("You must be logged in as a seller to create a product.");
        return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    const payload = {
        ...data,
        sellerId: user._id,
        minimumOrderQuantity: Number(data.minimumOrderQuantity),
        stockQuantity: Number(data.stockQuantity),
        // --- FIX 3: Correctly map maxQuantity to the payload ---
        pricingTiers: data.pricingTiers.map(tier => ({
            minQuantity: Number(tier.minQuantity),
            maxQuantity: tier.maxQuantity ? Number(tier.maxQuantity) : undefined,
            pricePerUnit: Number(tier.pricePerUnit)
        }))
    };
    
    try {
        const response = await apiClient.products.create(payload);
        const newProductId = response.data._id;
        toast.success("Product details created! Let's add some images.");
        router.push(`/products/${newProductId}/edit-product`);
        router.refresh();
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.message) {
          const message = Array.isArray(error.response.data.message) 
            ? error.response.data.message.join(', ') 
            : String(error.response.data.message);
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
        <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <p className="text-sm text-muted-foreground mb-4">Step 1: Fill in the product details. You will upload images in the next step.</p>
            <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Product Name</FormLabel> <FormControl><Input placeholder="e.g., Samsung Galaxy S24 Ultra" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Product Description</FormLabel> <FormControl><Textarea placeholder="Describe the product's features, benefits, and specifications." rows={5} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
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
                <FormMessage>{form.formState.errors.pricingTiers?.root?.message}</FormMessage>
            </div>
        </div>
        
        {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}

        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save and Continue to Images
            </Button>
        </div>
      </form>
    </Form>
  );
}