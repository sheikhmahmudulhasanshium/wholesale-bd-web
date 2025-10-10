"use client";

import { useLanguage } from "../contexts/language-context";
import { footerlinks, footerDescriptions, sociallinks } from "@/lib/menu";
import Image from "next/image";
import { useState, useEffect } from "react";

const Footer = () => {
  const { language } = useLanguage();

  const links = language === "bn"
    ? footerlinks.find(item => item.bangla)?.bangla
    : footerlinks.find(item => item.english)?.english;

  const description = footerDescriptions[language === "bn" ? "bn" : "en"];

  // Loading state for skeletons
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Main Section: Uses Flexbox on large screens for better spacing */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-y-10 lg:gap-8">
          
          {/* Column 1: Company Info & Description */}
          <div className="space-y-4 lg:max-w-sm">
            {/* Logo */}
            {loading ? (
              <div className="w-28 h-12 bg-slate-700 animate-pulse rounded-md" />
            ) : (
              <Image
                src="/logo/logo.svg" // Make sure you are using the final SVG logo we created
                alt="Wholesale BD Logo"
                className="w-44 h-auto" // Adjusted width for the wider logo
                loading="lazy"
                width={170}
                height={100}
              />
            )}

            {/* START: New Tagline Section */}
            <div className="pt-2">
              {loading ? (
                <div className="h-5 w-3/4 bg-slate-700 animate-pulse rounded-md mb-3" />
              ) : (
                <p className="text-base italic text-slate-300 mb-3">
                  &ldquo;{description.tagline}&rdquo;
                </p>
              )}
            </div>
            {/* END: New Tagline Section */}
            
            {/* Description */}
            <div className="text-sm">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <p>{description.medium}</p>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Grouping for Quick Links */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">
                {language === 'bn' ? 'লিঙ্ক' : 'Quick Links'}
              </h3>
              <ul className="mt-4 space-y-3">
                {links?.map((link) => (
                  <li key={link.link}>
                    <a
                      href={link.link}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-300"
                      title={link.name}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials with a BOLD separator */}
        <div className="mt-12 pt-8 border-t-2 border-slate-700 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-center sm:text-left mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Wholesale BD. All rights reserved.
          </p>
          
          <div className="flex justify-center space-x-5">
            {sociallinks.map(({ name, link, icon: Icon }) => (
              <a
                key={name}
                href={link}
                aria-label={name}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;