import { useEffect, useState } from 'react';
import { subscribeToFacility } from '../services/facilityService';
export function useFacilities(facilityIds = []) {
  const key = JSON.stringify(facilityIds);
  const [records, setRecords] = useState({});
  useEffect(() => {
    const ids = JSON.parse(key);
    const stops = ids.map(id => subscribeToFacility(id,
      (facility, meta) => setRecords(previous => ({ ...previous, [id]: { facility, ...meta, error: '' } })),
      error => setRecords(previous => ({ ...previous, [id]: { facility: null, error: error.message, fromCache: true } }))));
    return () => stops.forEach(stop => stop());
  }, [key]);
  return {
    facilities: facilityIds.map(id => records[id]?.facility).filter(Boolean),
    loading: facilityIds.some(id => !records[id]),
    error: facilityIds.map(id => records[id]?.error).filter(Boolean).join(' '),
    fromCache: facilityIds.some(id => records[id]?.fromCache !== false),
  };
}
