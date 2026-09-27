import { useEffect, useState } from "react";
import { subscribeToTrain } from "../services/venueService";
import { demoTrain, demoState } from "../data/demoData";

const DEMO_MODE = false;

export const useVenue = (trainId) => {
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trainId) {
      setTrain(null);
      setLoading(false);
      return;
    }

    if (DEMO_MODE) {
      setTrain({
        ...demoTrain,
        platform: demoState.platform,
      });

      setLoading(false);
      return;
    }

    setLoading(true);

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
  };
};