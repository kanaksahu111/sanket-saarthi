import { useEffect, useState } from "react";
import { subscribeToFacility } from "../services/facilityService";
import { demoFacilities } from "../data/demoData";

const DEMO_MODE = false;

export const useFacilities = (facilityIds = []) => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (facilityIds.length === 0) {
      setFacilities([]);
      setLoading(false);
      return;
    }

    if (DEMO_MODE) {
      const selectedFacilities = demoFacilities.filter((facility) =>
        facilityIds.includes(facility.id)
      );

      setFacilities(selectedFacilities);
      setLoading(false);
      return;
    }

    setLoading(true);

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
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [facilityIds.join("|")]);

  return {
    facilities,
    loading,
  };
};