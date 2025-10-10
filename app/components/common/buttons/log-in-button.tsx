// components/common/buttons/log-in-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

const LoginButton = () => {
  const handleLogin = () => {
    // This will initiate the Google sign-in flow defined in auth.ts
    // After a successful login, the user will be redirected to /home
    signIn("google", { callbackUrl: "/home" });
  };

  return (
    <Button variant={'default'} className="group" onClick={handleLogin}>
      {/* Text is hidden on mobile, visible on medium screens and up */}
      <span className="hidden sm:inline group-hover:text-primary-foreground/90 transition-colors">
        Log-in
      </span>

      {/* The icon has a subtle animation on hover */}
      <LogIn className="h-4 w-4 sm:ml-2 transition-transform group-hover:translate-x-1" />
    </Button>
  );
};

export default LoginButton;