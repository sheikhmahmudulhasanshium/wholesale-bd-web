// app/(routes)/profile/[id]/body.tsx
"use client";

import React from "react";
import Link from "next/link";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Mail, Phone, ShieldCheck, Tag } from "lucide-react";
import { Product, PublicUserProfile } from "@/lib/types";
import { useLanguage } from "@/app/components/contexts/language-context";
import { ProductCard } from "@/app/components/common/product-card";

// --- THIS IS THE FIX ---
// Explicitly define the props that this component will receive.
interface BodyProps {
    user: PublicUserProfile;
    products: Product[];
}

// Apply the BodyProps type to the component's function signature.
export default function Body({ user, products }: BodyProps) {
// --- END OF FIX ---
    const { language } = useLanguage();

    const getInitials = (displayName?: string) => {
        if (!displayName) return "??";
        const parts = displayName.split(' ');
        if (parts.length > 1) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
    };
    
    const memberSinceFormatted = user.memberSince ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(user.memberSince)) : null;
    const backgroundStyle = user.backgroundPicture ? { backgroundImage: `url(${user.backgroundPicture})` } : {};
    
    return (
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <main className="container mx-auto max-w-5xl py-8 px-4">
                <div 
                    className="h-48 md:h-64 rounded-t-lg bg-muted bg-cover bg-center"
                    style={backgroundStyle}
                />
                <Card className="relative -mt-16">
                    <CardHeader className="flex flex-col md:flex-row items-center md:items-end gap-6 border-b pb-6">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background -mt-12 md:-mt-16">
                            <AvatarImage src={user.profilePicture ?? undefined} alt={user.displayName} />
                            <AvatarFallback className="text-4xl">{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <h1 className="text-3xl font-bold">{user.displayName}</h1>
                            {user.contactName && <p className="text-lg text-muted-foreground">{user.contactName}</p>}
                            {user.isTrustedUser && <Badge variant="secondary" className="border-green-500 text-green-600"><ShieldCheck className="mr-2 h-4 w-4" /> Trusted Seller</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-muted-foreground">
                            {user.email && <Link href={`mailto:${user.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="h-4 w-4" /> {user.email}</Link>}
                            {user.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {user.phone}</div>}
                            {memberSinceFormatted && <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Member since {memberSinceFormatted}</div>}
                        </div>
                        {user.address && <p className="mt-4 text-center md:text-left">{user.address}</p>}
                    </CardContent>
                </Card>

                <Separator className="my-8" />
                
                <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Tag className="h-6 w-6 text-primary"/> Products by this Seller</h2>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {products.map(product => <ProductCard key={product._id} product={product} language={language}/>)}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">This seller has not listed any products yet.</p>
                    )}
                </div>
            </main>
        </BasicPageProvider>
    );
}