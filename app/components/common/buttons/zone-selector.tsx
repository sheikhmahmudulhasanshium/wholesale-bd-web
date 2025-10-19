// components/ZoneSelector.tsx - NO CHANGES NEEDED IN LOGIC
"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { useLanguage } from "@/app/components/contexts/language-context";
import { useZone } from "@/app/components/contexts/zone-context";
import { ChevronDown, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * A modular component for selecting a zone, featuring a multi-column dropdown layout.
 * The selected item is bold with a checkmark on the left.
 */
export function ZoneSelector() {
  // ALL HOOK CALLS MUST BE AT THE TOP LEVEL, UNCONDITIONAL
  const { language } = useLanguage();
  const {
    selectedZoneId, // Now holds the API's _id
    selectedZoneName, // Holds the selected zone's full name object
    setZone: setSelectedZone,
    zoneGroups,
    loadingZones,
    zonesError
  } = useZone(); // No change needed here, just the variable name for the ID

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);

  // useEffect should also be at the top level
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (zoneRef.current && !zoneRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [zoneRef]);

  // --- Conditional RENDER logic starts AFTER all hooks are called ---

  if (loadingZones) {
    return (
        <Button
            variant={'outline'}
            className="flex items-center gap-2 px-2 sm:px-3 h-8 animate-pulse"
        >
            <MapPin className="h-4 w-4" />
            <span className="font-semibold text-sm">Loading Zones...</span>
        </Button>
    );
  }

  if (zonesError) {
    return (
        <Button
            variant={'destructive'}
            className="flex items-center gap-2 px-2 sm:px-3 h-8"
        >
            <MapPin className="h-4 w-4" />
            <span className="font-semibold text-sm">Error Loading Zones</span>
        </Button>
    );
  }

  return (
    <div className="relative h-full flex items-center" ref={zoneRef}>
      <Button
        variant={'outline'}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-2 sm:px-3 h-8"
      >
        <MapPin className="h-4 w-4" />
        <span className="font-semibold text-sm">
          {selectedZoneName ? selectedZoneName[language] : "Select Zone"}
        </span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 rounded-md shadow-lg bg-background border z-50 animate-in fade-in-0 zoom-in-95 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
          <div className="p-2">
            {zoneGroups.map((group, index) => (
              <Fragment key={group.title.en}>
                {index > 0 && <div className="my-2 h-px bg-border" />}
                <div className="px-2 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                  {group.title[language]}
                </div>

                <div
                  className={
                    group.options.length > 4
                      ? "grid grid-cols-2 gap-1"
                      : "flex flex-col gap-1"
                  }
                >
                  {group.options.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone.id); // This now passes the _id
                        setIsDropdownOpen(false);
                      }}
                      className="w-full rounded-md text-left flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {selectedZoneId === zone.id ? ( // Compare with selectedZoneId (the _id)
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}

                      <span className={selectedZoneId === zone.id ? 'font-semibold' : ''}>
                        {zone.name[language]}
                      </span>
                    </button>
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}