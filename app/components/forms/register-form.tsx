// components/forms/register-form.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Chrome, Loader2, Eye, EyeOff } from 'lucide-react';
import { translations } from '@/lib/data';
import { useLanguage } from '../contexts/language-context';
import apiClient from '@/lib/apiClient';

const createFormSchema = (t: typeof translations.en) => z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: t.invalidEmail }),
  password: z.string().min(6, { message: t.passwordTooShort }),
});

export function RegisterForm() {
    const { language } = useLanguage();
    const t = translations[language];
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const formSchema = createFormSchema(t);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Use the new apiClient
            await apiClient.auth.register(values);
            toast.success("Registration successful!", {
                description: "Please check your email to verify your account. Redirecting to login...",
            });
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (error) {
            // Error is already handled by the global interceptor's toast.
             const message = error instanceof Error ? error.message : "Registration failed";
             if (message.toLowerCase().includes('email')) {
                form.setError('email', { type: 'manual', message });
             } else {
                form.setError('root', { type: 'manual', message });
             }
        } finally {
            setIsLoading(false);
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = apiClient.auth.getGoogleLoginUrl();
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" className="w-full" disabled={isLoading} onClick={handleGoogleLogin}>
                <Chrome className="mr-2 h-4 w-4" />
                {t.loginWithGoogle}
            </Button>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t.orContinueWith}</span></div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => ( 
                        <FormItem> 
                            <FormLabel>Full Name</FormLabel> 
                            <FormControl> 
                                <Input placeholder="John Doe" {...field} disabled={isLoading} /> 
                            </FormControl> 
                            <FormMessage /> 
                        </FormItem> 
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => ( 
                        <FormItem> 
                            <FormLabel>{t.emailLabel}</FormLabel> 
                            <FormControl> 
                                <Input placeholder={t.emailPlaceholder} {...field} disabled={isLoading} /> 
                            </FormControl> 
                            <FormMessage /> 
                        </FormItem> 
                    )} />
                    
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.passwordLabel}</FormLabel>
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
                                            aria-label={showPassword ? t.hidePasswordAria : t.showPasswordAria}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <p className="text-xs text-muted-foreground">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-primary">{t.termsOfService}</Link>{' '}
                        {t.and}{' '}
                        <Link href="/privacy" className="underline hover:text-primary">{t.privacyPolicy}</Link>.
                    </p>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                        Create Account
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Log in
                </Link>
            </p>
        </div>
    );
}