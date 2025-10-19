
// --- 3. A CLIENT COMPONENT TO HANDLE THE HASH ---
// Create this in a separate file, e.g., components/settings-navigation.tsx
"use client"
import { useEffect } from 'react';
import Link from 'next/link';

function SettingsNavigation() {
  useEffect(() => {
    // This code runs ONLY on the client after hydration
    if (window.location.hash) {
      const id = window.location.hash.substring(1); // Get "appearance" from "#appearance"
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <nav className="flex gap-4 mt-4 border-b pb-2">
      <Link href="#appearance">Appearance</Link>
      <Link href="#account">Account</Link>
    </nav>
  );
}
export { SettingsNavigation };