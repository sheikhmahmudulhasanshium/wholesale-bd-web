'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import apiClient from '@/lib/apiClient';
import { Header } from '../login/header';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
const formSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address." }),
});
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const response = await apiClient.auth.forgotPassword(values);
        toast.success("Request sent!", {
            description: response.data.message || "If an account exists, a reset code has been sent.",
        });
        router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
        form.setError("root", { message: "Failed to send reset email. Please try again later." });
        console.log(error);
    } finally {
        setIsLoading(false);
    }
  }
  return (
    <BasicPageProvider header={<Header/>} footer={null}>
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Forgot Your Password?</h1>
                    <p className="text-muted-foreground mt-2">
                        No problem. Enter your email address below and we&apos;ll send you a code to reset it.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                className="pl-10"
                                                placeholder="you@example.com" 
                                                {...field} 
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Reset Code
                        </Button>
                    </form>
                </Form>
                 <p className="text-center text-sm text-muted-foreground">
                    Remembered your password?{' '}
                    <Link href="/login" className="font-medium underline hover:text-primary">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    </BasicPageProvider>
  );
}