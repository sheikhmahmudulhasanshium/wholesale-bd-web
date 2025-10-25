// app/not-found.tsx

import { Button } from "@/components/ui/button";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "@/app/components/common/header";
import Footer from "@/app/components/common/footer";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sorry, we couldn&apos;t find the page you were looking for.
        </p>
        <div className="mt-6 flex gap-4">
            <Button asChild>
                <Link href="/">Go Back Home</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/products">View All Products</Link>
            </Button>
        </div>
      </div>
    </BasicPageProvider>
  );
}