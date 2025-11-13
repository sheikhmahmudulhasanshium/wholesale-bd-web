// app/components/common/buttons/become-seller.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { IdCardIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

const BecomeSeller = () => {
  const { user, isLoading } = useAuth();
  const [texts, setTexts] = useState([
    "Start Selling?",
    "Register Now",
    "Become a Seller",
  ]);
  const [index, setIndex] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const interval = setInterval(() => {
      if (mountedRef.current) {
        setIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }
    }, 2500);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [texts]);

  // --- V NEW: Conditional Rendering Logic ---
  if (isLoading) {
    return <Skeleton className="h-10 w-[170px] rounded-full" />;
  }

  // Hide button for sellers and admins
  if (user && (user.role === 'seller' || user.role === 'admin')) {
    return null;
  }
  // --- ^ END of NEW ---

  const textVariants = {
    enter: { opacity: 0, y: 4, scale: 0.995 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.995 },
  };

  const buttonSizeClasses =
    "px-6 py-2 text-sm font-semibold rounded-full focus:outline-none transition-all duration-300 ease-in-out";
  const fixedButtonClasses = "w-auto min-w-[170px]";

  return (
    <Button
      size="lg"
      className={`
        ${fixedButtonClasses} 
        bg-primary text-secondary
        hover:bg-secondary hover:text-primary
        ${buttonSizeClasses}
        relative
        ring-primary ring-0 hover:ring-2
        flex items-center justify-center
        overflow-hidden
      `}
      asChild
    >
      <Link href="/register/seller">
        <IdCardIcon size={18} className="absolute left-3 inline-block" />
        <span className="inline-block align-middle h-5 w-auto ml-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={texts[index]}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="whitespace-nowrap block"
              style={{ willChange: "opacity, transform" }}
            >
              {texts[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </Link>
    </Button>
  );
};

export default BecomeSeller;