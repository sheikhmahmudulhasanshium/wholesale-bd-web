// app/layout.tsx

import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google"; // Corrected font imports
import "./globals.css";
import { ThemeProvider } from "./components/providers/theme-provider";
import { LanguageProvider } from "./components/contexts/language-context";
import { ZoneProvider } from "./components/contexts/zone-context";
import { AuthProvider } from "./components/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Correctly define Poppins as the main 'sans' font
const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-poppins", // Assign it to a CSS variable
  weight: ['400', '500', '600', '700'] // Include the weights you'll use
});

// Correctly define Geist Mono as the 'mono' font
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-geist-mono", // Assign it to a CSS variable
});

export const metadata: Metadata = {
  title: "Wholesale BD Web App",
  description: "The official web application for Wholesale BD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply the font variables to the body tag */}
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <LanguageProvider>
                <ZoneProvider>
                  {children}
                  <Toaster richColors position="top-right" />
                </ZoneProvider>
              </LanguageProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}