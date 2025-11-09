import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { IdCardIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BecomeSeller = () => {
    
  // Use state to store the texts array so it can be easily updated
  const [texts, setTexts] = useState(["Has Business?", "Become Seller", "Start Selling", "Seller Login"]);

  const [index, setIndex] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    setIsClient(true);
    mountedRef.current = true;

    // Continue to loop through the texts array indefinitely
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length); // This makes the index loop through the texts array
    }, 2000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [texts]); // The interval is also dependent on the texts array

  // Motion variants for smooth text transitions
  const textVariants = {
    enter: { opacity: 0, y: 4, scale: 0.995 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.995 },
  };

  // Button size class
  const buttonSizeClasses = 'px-6 py-2 text-sm font-semibold rounded-full focus:outline-none transition-all duration-300 ease-in-out';

  // Ensure button doesn't shrink or grow
  const fixedButtonClasses = 'w-auto min-w-[160px]';
  const [isClient, setIsClient] = useState(false);

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
        >
          {/* Icon: Positioned absolutely to stay in place */}
          <IdCardIcon
            size={18}
            className="absolute left-3 inline-block"
          />

          {/* Animated text: AnimatePresence handles mount/unmount crossfade */}
          <span className="inline-block align-middle h-5 w-auto ml-8">
            {/* Adding margin left to avoid overlap with icon */}
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
        </Button>

     );
}
 
export default BecomeSeller
