// app/components/auth/googleSignIn.tsx

"use client";

import { Button } from "@/components/ui/button";
import { translations } from "@/lib/data";
import { Chrome } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/language-context";

export function SignInWithGoogleButton() {
  const { language } = useLanguage();
  const t = translations[language];

  const handleSignIn = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined.");
      toast.error("Configuration error. Please try again later.");
      return;
    }
    // Redirect the user to the backend endpoint that starts the Google OAuth flow.
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleSignIn}>
      <Chrome className="mr-2 h-4 w-4" />
      {t.loginWithGoogle}
    </Button>
  );
}