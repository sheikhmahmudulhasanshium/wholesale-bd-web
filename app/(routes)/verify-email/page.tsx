'use client';
import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import apiClient from '@/lib/apiClient';
import { Header } from '../login/header';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
const formSchema = z.object({
  otp: z.string().trim().min(6, { message: "OTP must be 6 digits." }).max(6),
});
function VerifyEmailComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  useEffect(() => {
    if (!email) {
      toast.error("No email specified. Redirecting to register.");
      router.replace('/register');
    }
  }, [email, router]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!email) return;
    setIsLoading(true);
    try {
        await apiClient.auth.verifyEmail({ email, otp: values.otp });
        toast.success("Email verified successfully!", {
            description: "Redirecting to the login page...",
        });
        setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
        form.setError("otp", { type: "manual", message: "Invalid or expired OTP. Please try again." });
        console.log(error);
    } finally {
        setIsLoading(false);
    }
  }
  const handleResendCode = async () => {
    if (!email) return;
    setIsResending(true);
    try {
        await apiClient.auth.resendVerification({ email });
        toast.success("A new verification code has been sent to your email.");
    } catch (error) {
        // Error is handled by global interceptor
        console.log(error);
    } finally {
        setIsResending(false);
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
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Verify Your Email</h1>
                    <p className="text-muted-foreground">
                        We&apos;ve sent a 6-digit code to <strong>{email}</strong>. Please enter it below.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="123456" 
                                            {...field} 
                                            disabled={isLoading}
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify Account
                        </Button>
                    </form>
                </Form>
                 <p className="text-center text-sm text-muted-foreground">
                    Didn&apos;t receive the code?{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={handleResendCode} disabled={isResending}>
                       {isResending ? 'Sending...' : 'Resend Code'}
                    </Button>
                </p>
            </div>
        </div>
    </BasicPageProvider>
  );
}
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        }>
            <VerifyEmailComponent />
        </Suspense>
    );
}