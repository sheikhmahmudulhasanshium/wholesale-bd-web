import { Suspense } from "react";
import AuthCallbackClient from "./body";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "../../login/header";
import { Loader2 } from "lucide-react";

// Fallback component to be shown while the client component loads
function LoadingFallback() {
  return (
    <BasicPageProvider header={<Header />} footer={null}>
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    </BasicPageProvider>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackClient />
    </Suspense>
  );
}