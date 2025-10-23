// app/(routes)/reset-password/page.tsx

'use client';
import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import apiClient from '@/lib/apiClient';
import { Header } from '../login/header';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';

// CHANGED: The schema now only requires the new password. The token comes from the URL.
const formSchema = z.object({
  newPassword: z.string().trim().min(8, "Password must be at least 8 characters long."),
});

const generateSecurePassword = (length = 12) => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allChars = upper + lower + numbers + symbols;
    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};

function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // CHANGED: We now get the 'token' from the URL, not the 'email'.
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // CHANGED: Check for the token's presence.
    if (!token) {
      toast.error("Invalid or missing reset token. Please request a new link.");
      router.replace('/forgot-password');
    }
  }, [token, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // CHANGED: Removed 'otp' from default values.
    defaultValues: { newPassword: "" },
  });

  const handleGeneratePassword = () => {
    const generatedPassword = generateSecurePassword();
    form.setValue('newPassword', generatedPassword, { shouldValidate: true });
    setShowPassword(true);
    toast.success("A secure password has been generated.");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // CHANGED: Check for token again before submitting.
    if (!token) return;
    
    setIsLoading(true);
    try {
        // CHANGED: Pass the 'token' from the URL and the 'newPassword' from the form.
        await apiClient.auth.resetPassword({ token, newPassword: values.newPassword });
        toast.success("Password Reset Successfully!", {
            description: "You can now log in with your new password.",
        });
        router.push('/login');
    } catch (error) {
        // CHANGED: The error is now generic as there's no OTP field to attach it to.
        toast.error("Invalid or expired token. Please try again.");
        console.log(error);
    } finally {
        setIsLoading(false);
    }
  }

  // CHANGED: Render loading spinner while validating the token.
  if (!token) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <BasicPageProvider header={<Header/>} footer={null}>
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Create a New Password</h1>
                    {/* CHANGED: Updated the descriptive text. */}
                    <p className="text-muted-foreground mt-2">
                        Please enter a new password for your account below.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* REMOVED: The entire FormField for 'otp' is gone. */}
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>New Password</FormLabel>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto px-2 py-1 text-xs"
                                            onClick={handleGeneratePassword}
                                            disabled={isLoading}
                                        >
                                            <Wand2 className="mr-1 h-3 w-3" />
                                            Generate
                                        </Button>
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="••••••••" 
                                                className="pr-10" 
                                                {...field} 
                                                disabled={isLoading} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)} 
                                                className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Password
                        </Button>
                    </form>
                </Form>
                 <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link href="/login" replace className="font-medium underline hover:text-primary">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    </BasicPageProvider>
  );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        }>
            <ResetPasswordComponent />
        </Suspense>
    );
}