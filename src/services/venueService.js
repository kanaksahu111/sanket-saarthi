import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { changeOperation } from './operationsService';
const trains = collection(db, 'venues', 'central-station', 'trains');
export async function getTrain(id) { const s = await getDoc(doc(trains, id)); return s.exists() ? { id: s.id, ...s.data() } : null; }
export function subscribeToTrain(id, callback, onError) {
  return onSnapshot(doc(trains, id), { includeMetadataChanges: true }, s => callback(s.exists() ? { id: s.id, ...s.data() } : null, { fromCache: s.metadata.fromCache, pending: s.metadata.hasPendingWrites }), onError);
}
export function updateTrainPlatform(id, platform, expected) { return changeOperation('trains', id, 'platform', platform, expected); }
