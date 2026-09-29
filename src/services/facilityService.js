import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { changeOperation } from './operationsService';
const facilities = collection(db, 'venues', 'central-station', 'facilities');
export async function getFacility(id) { const s = await getDoc(doc(facilities, id)); return s.exists() ? { id: s.id, ...s.data() } : null; }
export function subscribeToFacility(id, callback, onError) {
  return onSnapshot(doc(facilities, id), { includeMetadataChanges: true }, s => callback(s.exists() ? { id: s.id, ...s.data() } : null, { fromCache: s.metadata.fromCache, pending: s.metadata.hasPendingWrites }), onError);
}
export function updateFacilityStatus(id, status, expected) { return changeOperation('facilities', id, 'status', status, expected); }
