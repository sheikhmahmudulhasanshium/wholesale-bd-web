// @/app/components/common/countdown-timer.tsx

"use client";

import { useLanguage } from '@/app/components/contexts/language-context';
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
}

const calculateTimeLeft = (endDate: string) => {
  const difference = +new Date(endDate) - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the countdown only runs on the client, avoiding hydration mismatches
    setIsClient(true);
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [endDate]);

  if (!isClient) {
    // Render a placeholder on the server and during initial hydration
    return null;
  }

  const timerComponents = [
    { label: language === 'bn' ? 'দিন' : 'Days', value: timeLeft.days },
    { label: language === 'bn' ? 'ঘন্টা' : 'Hours', value: timeLeft.hours },
    { label: language === 'bn' ? 'মিনিট' : 'Mins', value: timeLeft.minutes },
    { label: language === 'bn' ? 'সেকেন্ড' : 'Secs', value: timeLeft.seconds },
  ];
  
  const isExpired = !Object.values(timeLeft).some(val => val > 0);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 my-4 text-center">
      {isExpired ? (
        <span className="text-lg font-bold text-destructive">
          {language === 'bn' ? 'অফার শেষ' : 'Offer Expired'}
        </span>
      ) : (
        timerComponents.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center p-2 rounded-md bg-primary/10 w-16 sm:w-20">
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default CountdownTimer;