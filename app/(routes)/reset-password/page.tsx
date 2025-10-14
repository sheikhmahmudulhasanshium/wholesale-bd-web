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
const formSchema = z.object({
  otp: z.string().trim().length(6, "The code must be 6 digits."),
  newPassword: z.string().trim().min(6, "Password must be at least 6 characters long."),
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
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (!email) {
      toast.error("Invalid session. Please start over.");
      router.replace('/forgot-password');
    }
  }, [email, router]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "", newPassword: "" },
  });
  const handleGeneratePassword = () => {
    const generatedPassword = generateSecurePassword();
    form.setValue('newPassword', generatedPassword, { shouldValidate: true });
    setShowPassword(true);
    toast.success("A secure password has been generated.");
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!email) return;
    setIsLoading(true);
    try {
        await apiClient.auth.resetPassword({ email, ...values });
        toast.success("Password Reset Successfully!", {
            description: "You can now log in with your new password.",
        });
        router.push('/login');
    } catch (error) {
        form.setError("otp", { message: "Invalid or expired code. Please try again." });
        console.log(error);
    } finally {
        setIsLoading(false);
    }
  }
  if (!email) {
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
                    <p className="text-muted-foreground mt-2">
                        Enter the code sent to <strong>{email}</strong> and set a new password.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>6-Digit Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                    Entered the wrong email?{' '}
                    <Link href="/forgot-password" replace className="font-medium underline hover:text-primary">
                        Start Over
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