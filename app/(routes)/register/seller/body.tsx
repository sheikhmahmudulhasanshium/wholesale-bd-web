// app/(routes)/register/seller/body.tsx
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "./header";
import { useLanguage } from "@/app/components/contexts/language-context";
import { translations } from "@/lib/data";
import { SellerRegisterForm } from "@/app/components/forms/seller-register-form";
import { useAuth } from "@/app/components/contexts/auth-context";
import { toast } from "sonner"; // --- FIX: Added missing toast import ---

// --- Skeleton Component ---
const SellerRegisterPageSkeleton = () => (
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
          <div className="space-y-4 pt-6">
            {/* --- FIX: Replaced invalid `count` prop with a proper loop --- */}
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </main>
);

// --- Main Body Component ---
const Body = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && (user.role === 'seller' || user.role === 'admin')) {
      toast.info("You are already a seller or admin.", {
        description: "Redirecting you to your dashboard.",
      });
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || (isAuthenticated && user && (user.role === 'seller' || user.role === 'admin'))) {
    return (
      <BasicPageProvider header={<Header />} footer={null}>
        <SellerRegisterPageSkeleton />
      </BasicPageProvider>
    );
  }

  return (
    <BasicPageProvider header={<Header />} footer={null}>
      <main className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-4xl rounded-xl bg-card text-card-foreground shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col items-center justify-center rounded-l-xl bg-primary p-12">
              <Image src="/logo/logo.svg" alt={t.logoAlt} width={240} height={60} priority />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <div className="flex justify-center mb-6 lg:hidden">
                <Link href="/">
                  <Image src="/logo/logo.svg" alt={t.logoAlt} width={200} height={100} priority />
                </Link>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {isAuthenticated ? "Complete Your Seller Application" : "Become a Seller"}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {isAuthenticated ? `Welcome back, ${user?.firstName}! Just fill out your business details below.` : "Fill out the form below to start your seller journey."}
                </p>
              </div>
              <div className="mt-6">
                <SellerRegisterForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </BasicPageProvider>
  );
};

export default Body;