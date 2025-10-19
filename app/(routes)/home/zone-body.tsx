       "use client";

import { useLanguage } from "@/app/components/contexts/language-context";
import { useZone } from "@/app/components/contexts/zone-context";
import React from "react";

const ZoneBody = () => {
  const { selectedZoneId, selectedZoneCode, selectedZoneName, loadingZones, zonesError } = useZone();
  const { language } = useLanguage();

  if (loadingZones) {
    return <div className="p-4 text-center text-muted-foreground">Loading your preferred zone...</div>;
  }

  if (zonesError) {
    return <div className="p-4 text-center text-destructive">Failed to load zones. Displaying default content.</div>;
  }

  return (
    <div className="p-4">
      <p className="mb-2 text-sm">
        <span className="font-semibold">Currently selected Zone ID:</span>{" "}
        <span className="font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded text-primary">
          {selectedZoneId || "None"}
        </span>
      </p>
      <p className="mb-2 text-sm">
        <span className="font-semibold">Currently selected Zone Code:</span>{" "}
        <span className="font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded text-primary">
          {selectedZoneCode || "None"}
        </span>
      </p>

      {selectedZoneName ? (
        <p className="mb-4 text-lg">
          <span className="font-semibold">Zone Name ({language}):</span>{" "}
          <span className="font-bold text-primary">{selectedZoneName[language]}</span>
 </p>
      ) : (
        <p className="mb-4 text-lg text-muted-foreground">No zone selected or found.</p>
      )}

      {/* Additional zone-specific content */}
      <div className="mt-6 p-4 border rounded-md bg-background text-foreground">
        <h3 className="font-semibold text-lg mb-2">Zone Specific Information:</h3>
        <p>This is where content relevant to the selected zone would appear.</p>
        <p className="text-sm text-muted-foreground">
          For example, special offers, delivery information, or local news for{" "}
          <span className="font-medium text-primary">
            {selectedZoneName ? selectedZoneName[language] : "the selected zone"}
          </span>.
        </p>
      </div>
    </div>
  );
};

export default ZoneBody;
