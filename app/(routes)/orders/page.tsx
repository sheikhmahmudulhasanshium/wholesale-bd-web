// @/app/(routes)/orders/page.tsx

"use client";

import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrdersPage = () => {
    return ( 
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
                <Card>
                    <CardHeader>
                        <CardTitle>My Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This is where your order history will be displayed. Feature coming soon!</p>
                    </CardContent>
                </Card>
            </div>
        </BasicPageProvider>
     );
}
 
export default OrdersPage;