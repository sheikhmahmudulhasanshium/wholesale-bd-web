// @/app/(routes)/cart/components/admin-cart-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminCartView } from "@/lib/types";
import { User, ShoppingCart, Calendar, Hash } from "lucide-react";

interface AdminCartCardProps {
    cart: AdminCartView;
    currencyFormatter: Intl.NumberFormat;
}

export const AdminCartCard = ({ cart, currencyFormatter }: AdminCartCardProps) => {
    return (
        <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{cart.user.firstName} {cart.user.lastName}</CardTitle>
                        <CardDescription>{cart.user.email}</CardDescription>
                    </div>
                    <Badge variant={cart.status === 'active' ? 'default' : 'secondary'} className="capitalize">{cart.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">Role: <span className="font-semibold">{cart.user.role}</span></span>
                </div>
                 <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span>Items: <span className="font-semibold">{cart.summary.totalUniqueItems}</span></span>
                </div>
                 <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span>Total Qty: <span className="font-semibold">{cart.summary.totalQuantity}</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {/* --- VVVVVV REPLACED date-fns VVVVVV --- */}
                    <span>Updated: <span className="font-semibold">{new Date(cart.updatedAt).toLocaleDateString()}</span></span>
                    {/* --- ^^^^^^ END OF REPLACEMENT ^^^^^^ --- */}
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-lg font-bold text-primary w-full text-right">
                    {currencyFormatter.format(cart.summary.grandTotal)}
                </p>
            </CardFooter>
        </Card>
    );
};