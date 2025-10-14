"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AxiosError } from 'axios';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Chrome, Loader2, Eye, EyeOff, Wand2 } from 'lucide-react';
import { translations } from '@/lib/data';
import { useLanguage } from '../contexts/language-context';
import apiClient from '@/lib/apiClient';
const createFormSchema = (t: typeof translations.en) => z.object({
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().trim().email({ message: t.invalidEmail }),
  password: z.string().trim().min(6, { message: t.passwordTooShort }),
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
export function RegisterForm() {
    const { language } = useLanguage();
    const t = translations[language];
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const formSchema = createFormSchema(t);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { firstName: "", lastName: "", email: "", password: "" },
    });
    const handleGeneratePassword = () => {
        const generatedPassword = generateSecurePassword();
        form.setValue('password', generatedPassword, { shouldValidate: true });
        setShowPassword(true);
        toast.success("A secure password has been generated.");
    };
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await apiClient.auth.register(values);
            toast.success("Registration successful!", {
                description: "Redirecting you to verify your email.",
            });
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 409) {
                const errorMessage = error.response.data.message || "Registration failed.";
                if (errorMessage.toLowerCase().includes("email already exists")) {
                    form.setError('email', { type: 'manual', message: 'This email is already taken.' });
                }
            } else {
                 toast.error("An unexpected error occurred during registration.");
            }
        } finally {
            setIsLoading(false);
        }
    }
    const handleGoogleLogin = () => {
        toast.info("Google Sign-Up is currently unavailable.");
    };
    return (
        <div className="space-y-6">
            <Button variant="outline" className="w-full" disabled={true} onClick={handleGoogleLogin}>
                <Chrome className="mr-2 h-4 w-4" />
                {t.loginWithGoogle}
            </Button>
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t.orContinueWith}</span></div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => ( 
                          <FormItem> 
                              <FormLabel>First Name</FormLabel> 
                              <FormControl> 
                                  <Input placeholder="John" {...field} disabled={isLoading} /> 
                              </FormControl> 
                              <FormMessage /> 
                          </FormItem> 
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => ( 
                          <FormItem> 
                              <FormLabel>Last Name</FormLabel> 
                              <FormControl> 
                                  <Input placeholder="Doe" {...field} disabled={isLoading} /> 
                              </FormControl> 
                              <FormMessage /> 
                          </FormItem> 
                      )} />
                    </div>
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>{t.passwordLabel}</FormLabel>
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