"use client";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
const LoginButton = () => {
  return (
    <Button variant={'default'} className="group" asChild>
      <Link href="/login">
        <span className="hidden sm:inline group-hover:text-primary-foreground/90 transition-colors">
          Log-in
        </span>
        <LogIn className="h-4 w-4 sm:ml-2 transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  );
};
export default LoginButton;