"use client";
import React, { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Chrome, Loader2, Eye, EyeOff } from "lucide-react";
import { translations } from "@/lib/data";
import { useLanguage } from "../contexts/language-context";
import apiClient from "@/lib/apiClient";
import { useAuth } from "../contexts/auth-context";
import { SignInWithGoogleButton } from "../auth/googleSignIn";
const createFormSchema = (t: typeof translations.en) =>
  z.object({
    email: z.string().trim().email({ message: t.invalidEmail }),
    password: z.string().trim().min(1, { message: "Password is required." }),
  });
export function LoginForm() {
  const { language } = useLanguage();
  const t = translations[language];
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formSchema = createFormSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await apiClient.auth.login(values);
      toast.success("Login successful! Redirecting...");
      login(response.data.access_token, response.data.user);
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: "Invalid email or password.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  const handleGoogleLogin = () => {
    toast.info("Google Sign-In is currently unavailable.");
  };
  return (
    <div className="space-y-6">
      {/* <Button variant="outline" className="w-full" disabled={true} onClick={handleGoogleLogin}>
                <Chrome className="mr-2 h-4 w-4" />
                {t.loginWithGoogle}
            </Button> */}
      <SignInWithGoogleButton />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {t.orContinueWith}
          </span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.emailPlaceholder}
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t.passwordLabel}</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline underline-offset-4"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                      {...field}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? t.hidePasswordAria : t.showPasswordAria
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.loginWithEmail}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-muted-foreground">
        {t.noAccount}{" "}
        <Link
          href="/register"
          className="underline underline-offset-4 hover:text-primary"
        >
          {t.signUp}
        </Link>
      </p>
    </div>
  );
}
