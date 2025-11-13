// app/(routes)/support/body.tsx
"use client";

import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, Mail, Phone } from "lucide-react";

const Body = () => {
    return ( 
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <LifeBuoy className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle className="text-2xl">Support Center</CardTitle>
                                <CardDescription>How can we help you today?</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Contact Us Directly</h3>
                            <p className="text-muted-foreground">For urgent issues or direct inquiries, please reach out to us through the following channels.</p>
                        </div>

                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <Mail className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Email Support</p>
                                <a href="mailto:support@wholesalebd.com" className="text-primary hover:underline">
                                    support@wholesalebd.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <Phone className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Phone Support</p>
                                <a href="tel:+8801234567890" className="text-primary hover:underline">
                                    +880 1234 567890
                                </a>
                                <p className="text-xs text-muted-foreground mt-1">Available from 9 AM to 6 PM (GMT+6)</p>
                            </div>
                        </div>

                         <div className="space-y-2 pt-4">
                            <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
                            <p className="text-muted-foreground">Answers to common questions will be available here soon.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </BasicPageProvider>
     );
}
 
export default Body;