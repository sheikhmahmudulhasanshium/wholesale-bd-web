// The file containing your Body component (e.g., app/login/page.tsx)
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BasicPageProvider } from '@/app/components/providers/basic-page-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from './header';
import { LoginForm } from '@/app/components/forms/login-form';
import { useLanguage } from '@/app/components/contexts/language-context';
import { translations } from '@/lib/data';
// --- THE FIX: Import the hook and translations ---


// --- Skeleton Component (No changes needed) ---
const LoginPageSkeleton = () => (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-card shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
                <div className="hidden lg:flex flex-col items-center justify-center rounded-l-xl bg-muted p-12">
                     <Skeleton className="h-16 w-48" />
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-12 space-y-6">
                    <div className="text-center space-y-2">
                        <Skeleton className="h-7 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                    <div className="space-y-6 pt-6">
                        <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-5 w-32 mx-auto" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    </main>
);

// --- Main Body Component ---
const Body = () => {
    const [isClient, setIsClient] = useState(false);
    // --- THE FIX: Get language and the correct translation object ---
    const { language } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <BasicPageProvider header={<Header />} footer={null}>
                <LoginPageSkeleton />
            </BasicPageProvider>
        );
    }
    
    return (
        <BasicPageProvider header={<Header />} footer={null}>
            <main className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-4xl rounded-xl bg-card text-card-foreground shadow-xl overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                        {/* Left Panel - Image */}
                        <div className="hidden lg:flex flex-col items-center justify-center rounded-l-xl bg-primary p-12">
                            <Image
                                src="/logo/logo.svg" 
                                // --- THE FIX: Use translated alt text ---
                                alt={t.logoAlt}
                                width={240}
                                height={60}
                                priority
                            />
                        </div>

                        {/* Right Panel - Form */}
                        <div className="flex flex-col justify-center p-8 sm:p-12">
                            <div className='flex justify-center mb-6 lg:hidden'>
                                <Link href="/">
                                    <Image
                                        src="/logo/logo.svg"
                                        // --- THE FIX: Use translated alt text ---
                                        alt={t.logoAlt}
                                        width={200}
                                        height={100}
                                        priority
                                    />
                                </Link>
                            </div>
                            
                            <div className="text-center">
                                {/* --- THE FIX: Use translated title --- */}
                                <h1 className='text-2xl font-semibold tracking-tight'>{t.loginTitle}</h1>
                            </div>
                            
                            <div className="mt-6">
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </BasicPageProvider> 
     );
}
 
export default Body;