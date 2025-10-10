"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { zoneGroups } from '@/lib/menu'; // Import your zone data

// Define the type for a zone ID
type ZoneId = string;

// Define the shape of the context
interface ZoneContextType {
  zone: ZoneId;
  setZone: (zoneId: ZoneId) => void;
}

// Create the context with a default value
const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

// Flatten all zones for easy validation and to get a default
const allZones = zoneGroups.flatMap(group => group.options);
const defaultZoneId = allZones[0]?.id || 'dha'; // Default to the first zone or a fallback

// Create the Provider component
export function ZoneProvider({ children }: { children: ReactNode }) {
  const [zone, setZoneState] = useState<ZoneId>(defaultZoneId);

  // On mount, try to get the zone from localStorage
  useEffect(() => {
    try {
      const storedZone = localStorage.getItem('zone') as ZoneId;
      // Validate that the stored zone still exists in our list of zones
      if (storedZone && allZones.some(z => z.id === storedZone)) {
        setZoneState(storedZone);
      }
    } catch (error) {
        console.error("Failed to access localStorage:", error);
    }
  }, []);

  // Function to set the zone and save it to localStorage
  const setZone = (newZoneId: ZoneId) => {
    setZoneState(newZoneId);
    try {
        localStorage.setItem('zone', newZoneId);
    } catch (error) {
        console.error("Failed to access localStorage:", error);
    }
  };

  return (
    <ZoneContext.Provider value={{ zone, setZone }}>
      {children}
    </ZoneContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useZone() {
  const context = useContext(ZoneContext);
  if (context === undefined) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
}