// app/components/forms/seller-register-form.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Eye, EyeOff } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { Zone } from "@/lib/types";
import { useAuth } from "../contexts/auth-context";

// Schema is now dynamic based on whether the user is logged in
const createSellerRegisterSchema = (isAuthenticated: boolean) => z.object({
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().trim().email({ message: "Please enter a valid email." }),
  password: isAuthenticated
    ? z.string().optional()
    : z.string().trim().min(8, { message: "Password must be at least 8 characters." }),
  businessName: z.string().trim().min(2, { message: "Business name is required." }),
  businessLicense: z.string().trim().min(5, { message: "A valid business license is required." }),
  businessDescription: z.string().trim().min(20, { message: "Description must be at least 20 characters." }).max(500, { message: "Description cannot exceed 500 characters." }),
  // --- FIX: Correct Zod syntax for required string message ---
  zone: z.string().min(1, { message: "Please select an operating zone." }),
});


export function SellerRegisterForm() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // --- FIX: Integrated zone fetching logic directly into the form component ---
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [zonesLoading, setZonesLoading] = useState(true);
  
  useEffect(() => {
    apiClient.zones.findAll()
      .then(res => setZones(res.data))
      .catch(err => console.error("Failed to fetch zones:", err))
      .finally(() => setZonesLoading(false));
  }, []);
  // --- End of integrated logic ---

  const sellerRegisterSchema = createSellerRegisterSchema(isAuthenticated);
  type SellerRegisterFormValues = z.infer<typeof sellerRegisterSchema>;

  const form = useForm<SellerRegisterFormValues>({
    resolver: zodResolver(sellerRegisterSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", password: "",
      businessName: "", businessLicense: "", businessDescription: "", zone: "",
    },
  });

  useEffect(() => {
    if (user && isAuthenticated) {
      form.reset({
        firstName: user.firstName, lastName: user.lastName, email: user.email,
        businessName: user.businessName || "", zone: user.zone || "",
      });
    }
  }, [user, isAuthenticated, form]);

  async function onSubmit(values: SellerRegisterFormValues) {
    setIsLoading(true);
    try {
      await apiClient.auth.sellerRegister(values);
      const successMessage = isAuthenticated ? "Application submitted successfully!" : "Seller registration submitted!";
      const successDescription = isAuthenticated ? "Your application is under review. We will notify you." : "Your application is under review. Please verify your email.";
      toast.success(successMessage, { description: successDescription });
      if (isAuthenticated) {
        router.push(`/dashboard`);
      } else {
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const message = error.response.data.message || "An error occurred.";
        form.setError(error.response.status === 409 ? "email" : "root", { type: "manual", message });
        if (error.response.status !== 409) toast.error("Registration Failed", { description: message });
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isFormLoading = isLoading || isAuthLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Fields for name, email, password etc. remain the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem> <FormLabel>First Name</FormLabel> <FormControl> <Input placeholder="John" {...field} disabled={isFormLoading || isAuthenticated} /> </FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem> <FormLabel>Last Name</FormLabel> <FormControl> <Input placeholder="Doe" {...field} disabled={isFormLoading || isAuthenticated} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email Address</FormLabel> <FormControl> <Input type="email" placeholder="name@company.com" {...field} disabled={isFormLoading || isAuthenticated} /> </FormControl> <FormMessage /> </FormItem> )}/>
        {!isAuthenticated && ( <FormField control={form.control} name="password" render={({ field }) => ( <FormItem> <FormLabel>Password</FormLabel> <FormControl> <div className="relative"> <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" {...field} disabled={isFormLoading} /> <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}> {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />} </button> </div> </FormControl> <FormMessage /> </FormItem> )}/> )}
        <div className="pt-4 border-t"> <h3 className="text-lg font-medium">Business Details</h3> <p className="text-sm text-muted-foreground mb-4">Provide your business information for verification.</p> </div>
        <FormField control={form.control} name="businessName" render={({ field }) => ( <FormItem> <FormLabel>Business Name</FormLabel> <FormControl> <Input placeholder="Doe's Electronics" {...field} disabled={isFormLoading} /> </FormControl> <FormMessage /> </FormItem> )}/>
        <FormField control={form.control} name="businessLicense" render={({ field }) => ( <FormItem> <FormLabel>Business License Number</FormLabel> <FormControl> <Input placeholder="BL123456789" {...field} disabled={isFormLoading} /> </FormControl> <FormMessage /> </FormItem> )}/>
        <FormField control={form.control} name="businessDescription" render={({ field }) => ( <FormItem> <FormLabel>Business Description</FormLabel> <FormControl> <Textarea placeholder="Describe your business, products, and target market..." className="resize-y min-h-[100px]" {...field} disabled={isFormLoading} /> </FormControl> <FormMessage /> </FormItem> )}/>
        
        {/* --- FIX: Integrated ZoneSelect logic is now here --- */}
        <FormField
          control={form.control}
          name="zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operating Zone</FormLabel>
              {zonesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isFormLoading || zonesLoading}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an operating zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {zones?.map((zone) => (
                      <SelectItem key={zone._id} value={zone.name}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isFormLoading}>
          {isFormLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isAuthenticated ? 'Submit Seller Application' : 'Register as a Seller'}
        </Button>
      </form>
      {!isAuthenticated && ( <p className="text-center text-sm text-muted-foreground mt-6"> Already have an account?{" "} <Link href="/login" className="underline underline-offset-4 hover:text-primary"> Log in here </Link> </p> )}
    </Form>
  );
}