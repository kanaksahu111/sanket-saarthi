import { useEffect, useState } from 'react';
import { subscribeToTrain } from '../services/venueService';
export function useVenue(trainId) {
  const [state, setState] = useState({ id: null, train: null, loading: true, error: '', fromCache: true });
  useEffect(() => {
    if (!trainId) return;
    return subscribeToTrain(trainId,
      (train, meta) => setState({ id: trainId, train, loading: false, error: '', ...meta }),
      error => setState({ id: trainId, train: null, loading: false, error: error.message, fromCache: true }));
  }, [trainId]);
  return trainId && state.id === trainId ? state : { train: null, loading: Boolean(trainId), error: '', fromCache: true };
}
