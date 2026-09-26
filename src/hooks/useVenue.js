import { useEffect, useState } from "react";
import { subscribeToTrain } from "../services/venueService";

export const useVenue = (trainId) => {
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!trainId) {
      setTrain(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTrain(trainId, (data) => {
      setTrain(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [trainId]);

  return {
    train,
    loading,
    error,
  };
};