// app/auth/callback/page.tsx

"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

// A component to handle the logic, wrapped in Suspense
function AuthCallbackLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error("OAuth Error:", error);
      toast.error("Login failed. Please try again.");
      router.replace('/login');
      return;
    }

    if (token) {
      console.log("OAuth token received, saving to localStorage...");
      // The key must match what your apiClient expects ('access_token')
      localStorage.setItem('access_token', token);
      
      toast.success("Logged in successfully!");

      // Redirect to the dashboard or a protected route
      // The 'replace' option prevents the user from navigating back to this callback page
      router.replace('/dashboard'); 
    } else {
      console.error("Auth callback page reached without a token.");
      toast.error("An unknown login error occurred. Please try again.");
      router.replace('/login');
    }
    
  // The effect should run only once when the component mounts and has access to the router and searchParams.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams]);

  // Render a loading state while the effect runs and redirects
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Finalizing Login
        </h1>
        <p className="text-muted-foreground">
          Please wait while we securely log you in...
        </p>
      </div>
    </div>
  );
}

// The page component itself, wrapping the logic in Suspense
// This is best practice when using useSearchParams in Next.js App Router
const AuthCallbackPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackLogic />
    </Suspense>
  );
};

export default AuthCallbackPage;