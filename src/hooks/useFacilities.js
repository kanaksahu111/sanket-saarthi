import { useEffect, useState } from "react";
import { subscribeToFacility } from "../services/facilityService";

export const useFacilities = (facilityIds = []) => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(facilityIds.length > 0);

  useEffect(() => {
    if (facilityIds.length === 0) {
      return;
    }

    const unsubscribes = facilityIds.map((facilityId) =>
      subscribeToFacility(facilityId, (facility) => {
        setFacilities((currentFacilities) => {
          const filtered = currentFacilities.filter(
            (item) => item.id !== facilityId
          );

          if (!facility) {
            return filtered;
          }

          return [...filtered, facility];
        });

        setLoading(false);
      })
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") unsubscribe();
      });
    };
  }, [facilityIds]);

  return {
    facilities,
    loading,
  };
};