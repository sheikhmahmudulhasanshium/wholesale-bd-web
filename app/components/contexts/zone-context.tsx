// contexts/zone-context.tsx - MODIFIED
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Zone as ApiZone } from '@/lib/types'; // Import the API Zone type
// Import icons directly for the static groups
import { Briefcase, Plane, Gift } from 'lucide-react'; 
import { useZones } from '../hooks/get-zones';

// Define the types that match your existing zoneGroups structure - MODIFIED
export type ZoneOption = {
  id: string; // This will now be the API's _id for dynamic zones, or a unique ID for static zones
  apiCode?: string; // Optional: To store the short code (e.g., "DHA") if needed elsewhere
  name: { en: string; bn: string };
  icon?: React.ComponentType<{ size: number, className?: string }>; 
};

export type ZoneGroup = {
  title: { en: string; bn: string };
  options: ZoneOption[];
};

// Define the type for a zone ID (which is now the API's _id)
type ZoneId = string;

// Define the shape of the context - MODIFIED
interface ZoneContextType {
  selectedZoneId: ZoneId; // This now holds the API's _id
  selectedZoneCode: string | null; // Added to return the API's 'code' separately
  selectedZoneName: { en: string; bn: string } | null; // Added to store the full name object
  setZone: (zoneId: ZoneId) => void;
  zoneGroups: ZoneGroup[]; // Expose the dynamically created zone groups
  loadingZones: boolean;
  zonesError: string | null;
}

// Create the context with a default value
const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

// Create the Provider component - MODIFIED
export function ZoneProvider({ children }: { children: ReactNode }) {
  const { zones: fetchedApiZones, loading: isLoadingZones, error: zonesFetchError } = useZones();
  const [currentDynamicZoneGroups, setCurrentDynamicZoneGroups] = useState<ZoneGroup[]>([]);
  const [activeZoneId, setActiveZoneId] = useState<ZoneId>(''); // Holds the _id
  const [activeZoneCode, setActiveZoneCode] = useState<string | null>(null); // Holds the 'code'
  const [activeZoneName, setActiveZoneName] = useState<{ en: string; bn: string } | null>(null); // New state for name

  // -----------------------------------------------------------
  // NEW: Manual Bangla translation map for API-fetched zones
  // Using useMemo to memoize the map
  const banglaTranslationsForZoneNames = useMemo(() => ({
    "Dhaka": "ঢাকা",
    "Chittagong": "চট্টগ্রাম",
    "Khulna": "খুলনা",
    "Sylhet": "সিলেট", 
    "Rajshahi": "রাজশahi", 
    "Barishal": "বরিশাল", 
    "Rangpur": "রংপুর", 
    "Mymensingh": "ময়মনসিংহ",
  }) as Record<string, string>, []); // Explicitly type as Record<string, string>
  // -----------------------------------------------------------

  // Define your static zone groups here using useMemo to ensure stability
  const staticZoneDataGroups = useMemo(() => ([
    {
      title: { en: "Corporate & Global", bn: "কর্পোরেট ও গ্লোবাল" },
      options: [
        {
          id: "corp-purchasing", // Use a more descriptive ID for static options
          name: { en: "Corporate Purchasing", bn: "কর্পোরেট কেনাকাটা" },
          icon: Briefcase,
        },
        {
          id: "intl-shipping",
          name: { en: "International Shipping", bn: "আন্তর্জাতিক শিপিং" },
          icon: Plane,
        },
        {
          id: "send-gift-bd",
          name: { en: "Send a Gift (BD)", bn: "উপহার পাঠান (বিডি)" },
          icon: Gift,
        },
      ],
    },
  ]), []); // Empty dependency array means this array is created once

  // Effect to process API zones and combine with static groups, then determine default zone
  useEffect(() => {
    let combinedGroups: ZoneGroup[] = [...staticZoneDataGroups]; // Start with static groups

    if (isLoadingZones) {
        setCurrentDynamicZoneGroups(combinedGroups); // Show static groups immediately if loading
        setActiveZoneName(null); 
        setActiveZoneCode(null); // Reset code when loading
        return;
    }

    if (zonesFetchError) {
        setCurrentDynamicZoneGroups(combinedGroups); // On error, just show static groups
        setActiveZoneId('');
        setActiveZoneName(null); // Reset on error
        setActiveZoneCode(null); // Reset code on error
        console.error("Failed to load zones for ZoneProvider:", zonesFetchError);
        return;
    }

    if (fetchedApiZones && fetchedApiZones.length > 0) {
      // Map API zones to the 'Local Divisions' group
      const localDivisionOptions: ZoneOption[] = fetchedApiZones.map((apiZone: ApiZone) => ({
        id: apiZone._id, // Use _id as the primary ID
        apiCode: apiZone.code, // Store the short code separately
        name: { 
            en: apiZone.name, 
            bn: banglaTranslationsForZoneNames[apiZone.name] || apiZone.name // Use translation or fallback to English
        },
      }));

      combinedGroups = [
        {
          title: { en: "Local Divisions", bn: "স্থানীয় বিভাগ" },
          options: localDivisionOptions,
        },
        ...staticZoneDataGroups, // Add static groups after local divisions
      ];
    } else {
        // If no API zones are returned or empty, then local divisions will not be present,
        // so combinedGroups correctly remains just the static groups.
    }

    setCurrentDynamicZoneGroups(combinedGroups);

    // Now, determine the selected zone from the combined list
    const allAvailableOptions: ZoneOption[] = combinedGroups.flatMap(group => group.options);
    const firstOptionAvailable = allAvailableOptions[0]; // Get the full option object

    let determinedActiveZoneId: ZoneId = '';
    let determinedActiveZoneCode: string | null = null;
    let determinedActiveZoneName: { en: string; bn: string } | null = null;

    try {
      const storedZoneIdentifier = localStorage.getItem('zone') as ZoneId; // This now stores the _id
      const foundStoredZoneOption = allAvailableOptions.find(z => z.id === storedZoneIdentifier);

      if (storedZoneIdentifier && foundStoredZoneOption) {
        determinedActiveZoneId = storedZoneIdentifier;
        determinedActiveZoneCode = foundStoredZoneOption.apiCode || null;
        determinedActiveZoneName = foundStoredZoneOption.name;
      } else if (firstOptionAvailable) {
        determinedActiveZoneId = firstOptionAvailable.id;
        determinedActiveZoneCode = firstOptionAvailable.apiCode || null;
        determinedActiveZoneName = firstOptionAvailable.name;
        localStorage.setItem('zone', determinedActiveZoneId);
      }
    } catch (error) {
      console.error("Failed to access localStorage for zone:", error);
      if (firstOptionAvailable) {
        determinedActiveZoneId = firstOptionAvailable.id;
        determinedActiveZoneCode = firstOptionAvailable.apiCode || null;
        determinedActiveZoneName = firstOptionAvailable.name;
        localStorage.setItem('zone', determinedActiveZoneId);
      }
    }
    
    setActiveZoneId(determinedActiveZoneId);
    setActiveZoneCode(determinedActiveZoneCode);
    setActiveZoneName(determinedActiveZoneName);

  }, [fetchedApiZones, isLoadingZones, zonesFetchError, banglaTranslationsForZoneNames, staticZoneDataGroups]); // Added banglaTranslationsForZoneNames, staticZoneDataGroups to dependencies

  // Function to set the zone and save it to localStorage
  const handleZoneSelection = (newZoneIdentifier: ZoneId) => {
    const allCurrentlyAvailableOptions = currentDynamicZoneGroups.flatMap(group => group.options);
    const selectedOptionDetails = allCurrentlyAvailableOptions.find(z => z.id === newZoneIdentifier);

    if (selectedOptionDetails) {
      setActiveZoneId(newZoneIdentifier);
      setActiveZoneCode(selectedOptionDetails.apiCode || null); // Set the code as well
      setActiveZoneName(selectedOptionDetails.name); // Set the name as well
      try {
        localStorage.setItem('zone', newZoneIdentifier);
      } catch (error) {
        console.error("Failed to access localStorage for setZone:", error);
      }
    } else {
        console.warn(`Attempted to set an invalid zone ID: ${newZoneIdentifier}`);
    }
  };

  return (
    <ZoneContext.Provider 
      value={{ 
        selectedZoneId: activeZoneId, // Provide the selected zone's _id
        selectedZoneCode: activeZoneCode, // Provide the selected zone's short code (e.g., "DHA")
        selectedZoneName: activeZoneName, // Provide the selected zone's full name object
        setZone: handleZoneSelection, 
        zoneGroups: currentDynamicZoneGroups, 
        loadingZones: isLoadingZones, 
        zonesError: zonesFetchError 
      }}>
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
