"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BasicPageProvider } from "@/app/components/providers/basic-page-provider";
import { Header } from "../../login/header";

export default function AuthCallbackClient() {
  const { checkLoggedInUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(error || "Google login failed. Please try again.");
      router.push('/login');
      return;
    }

    const handleAuth = async () => {
      // The backend has set the cookies. Now we just need to fetch the user data
      // and update our frontend state by calling the profile endpoint.
      await checkLoggedInUser();
      router.push('/dashboard'); 
      toast.success("Successfully logged in with Google!");
    };
    
    handleAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, checkLoggedInUser]);

  // This UI will be shown while the useEffect hook is running.
  return (
    <BasicPageProvider header={<Header />} footer={null}>
        <div className="flex min-h-screen w-full items-center justify-center">
        <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-lg">Finalizing your login, please wait...</p>
        </div>
        </div>
    </BasicPageProvider>
  );
}