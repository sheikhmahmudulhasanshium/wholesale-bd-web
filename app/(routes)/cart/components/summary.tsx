// @/app/(routes)/cart/components/summary.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartSearchResult } from "@/lib/types";
import { Loader2, Download, Info, AlertTriangle } from "lucide-react";

interface SummaryCardProps {
  cartItems: CartSearchResult[];
  summary: { totalQuantity: number; grandTotal: number };
  isProcessing: boolean;
  onCreateOrder: () => void;
  currencyFormatter: Intl.NumberFormat;
  translations: {
    summary: string;
    total: string;
    items: string;
    submitForApproval: string;
    priceWarning: string;
  };
  hasWarnings: boolean;
  // This prop is essential for displaying the correct item totals
  clientSidePrices: Record<string, number>;
}

export const SummaryCard = ({
  cartItems,
  summary,
  isProcessing,
  onCreateOrder,
  currencyFormatter,
  translations,
  hasWarnings,
  clientSidePrices,
}: SummaryCardProps) => {

  const handleDownload = () => {
    console.log("Download action triggered. Data:", cartItems);
    alert("Download functionality is not yet implemented.");
  };

  return (
    <div id="summary" className="lg:sticky top-24 scroll-mt-24">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">{translations.summary}</CardTitle>
          <Image
            src="/logo/logo.svg"
            alt="Company Logo"
            width={100}
            height={25}
            className="opacity-80"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex justify-between items-start text-sm">
                <div className="flex flex-col">
                  <span className="font-medium leading-tight max-w-[180px] truncate" title={item.product.name}>
                    {item.product.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ({item.quantity} units)
                  </span>
                </div>
                {/* --- VVVVVV THIS IS THE FIX VVVVVV --- */}
                {/* Use the correctly calculated price from the parent */}
                <span className="font-mono text-right">
                  {currencyFormatter.format(clientSidePrices[item.product._id] ?? 0)}
                </span>
                {/* --- ^^^^^^ END OF FIX ^^^^^^ --- */}
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-base font-semibold">
            <span>
              {translations.total} ({summary.totalQuantity} {translations.items})
            </span>
            <span className="text-primary font-mono">
              {currencyFormatter.format(summary.grandTotal)}
            </span>
          </div>
          
          {hasWarnings && (
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-destructive/10 p-3 text-destructive">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium">
                Please resolve the warnings on your cart items before proceeding.
              </p>
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-accent/80 dark:bg-accent/40 p-3 text-accent-foreground">
            <Info className="h-5 w-5 flex-shrink-0 " />
            <p className="text-xs font-medium">
              {translations.priceWarning}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-6">
          <Button
            size="lg"
            className="w-full"
            onClick={onCreateOrder}
            disabled={isProcessing || hasWarnings}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {translations.submitForApproval}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDownload}
            disabled={isProcessing}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};