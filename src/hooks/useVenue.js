import { useEffect, useState } from "react";
import { subscribeToTrain } from "../services/venueService";

export const useVenue = (trainId) => {
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(Boolean(trainId));
  const [error] = useState(null);

  useEffect(() => {
    if (!trainId) {
      return;
    }

    const unsubscribe = subscribeToTrain(trainId, (data) => {
      setTrain(data);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [trainId]);

  return {
    train,
    loading,
    error,
  };
};