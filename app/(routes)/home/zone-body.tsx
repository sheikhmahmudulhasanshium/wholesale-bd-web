"use client";

import { useLanguage } from "@/app/components/contexts/language-context";
import { useZone } from "@/app/components/contexts/zone-context";
import { useProducts } from "@/app/components/hooks/use-products";
import React from "react";

const ZoneBody = () => {
  const {
    selectedZoneId,
    selectedZoneCode,
    selectedZoneName,
    loadingZones,
    zonesError,
  } = useZone();
  const { language } = useLanguage();

  const productData = useProducts({
    zoneId: selectedZoneId || undefined,
    limit: 10,
    page: 1,
  });

  const hasZoneSelected = selectedZoneId && selectedZoneName;

  return (
    <div className="p-4">
      {/* Always show selected zone info if available */}
      {hasZoneSelected && (
        <>
          <p className="mb-2 text-sm">
            <span className="font-semibold">Currently selected Zone ID:</span>{" "}
            <span className="font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded text-primary">
              {selectedZoneId}
            </span>
          </p>
          <p className="mb-2 text-sm">
            <span className="font-semibold">Currently selected Zone Code:</span>{" "}
            <span className="font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded text-primary">
              {selectedZoneCode || "None"}
            </span>
          </p>
          <p className="mb-4 text-lg">
            <span className="font-semibold">Zone Name ({language}):</span>{" "}
            <span className="font-bold text-primary">
              {selectedZoneName[language] || "Unnamed"}
            </span>
          </p>
        </>
      )}

      {/* Feedback messages */}
      {loadingZones && (
        <div className="text-center text-muted-foreground">
          Loading your preferred zone...
        </div>
      )}

      {zonesError && (
        <div className="text-center text-destructive">
          Failed to load zones. Displaying available information.
        </div>
      )}

      {!hasZoneSelected && !loadingZones && !zonesError && (
        <div className="text-center text-muted-foreground">
          No zone selected. Please select a zone to see relevant content.
        </div>
      )}

      {hasZoneSelected && productData.data?.length === 0 && (
        <div className="text-center text-muted-foreground">
          No products found for the selected zone.
        </div>
      )}

      {/* Zone-specific content */}
      {hasZoneSelected && (
        <div className="mt-6 p-4 border rounded-md bg-background text-foreground">
          <h3 className="font-semibold text-lg mb-2">Zone Specific Information:</h3>
          <p>This is where content relevant to the selected zone would appear.</p>
          <p className="text-sm text-muted-foreground">
            For example, special offers, delivery information, or local news for{" "}
            <span className="font-medium text-primary">
              {selectedZoneName[language] || "the selected zone"}
            </span>.
          </p>
        </div>
      )}
    </div>
  );
};

export default ZoneBody;
