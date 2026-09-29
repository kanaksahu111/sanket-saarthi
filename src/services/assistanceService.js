import { addDoc, collection, doc, onSnapshot, query, where, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { requireStaff, visitorIdentity } from './authService';
import { TYPES, VENUE_ID } from '../data/journey';
import { getStationByCode } from './stationService';
import { validTransition } from '../data/support';
const requests = collection(db, 'assistanceRequests');
export async function createAssistanceRequest(request) {
  if (!TYPES.includes(request.type) || !request.location?.trim()) throw new Error('Choose assistance type and a meeting point.');
  const station=getStationByCode(request.stationCode||'BPL');
  if(!station)throw new Error('Select a station.');
  const user = await visitorIdentity();
  const result = await addDoc(requests, {
    stationCode:station.code,stationName:station.name,
    type:request.type, location:request.location.trim().slice(0,120), locationId:request.locationId || '',
    destination:request.destination || '', destinationId:request.destinationId || '',
    wheelchair:Boolean(request.wheelchair), human:Boolean(request.human), support:(request.support || '').slice(0,120), journeyId:request.journeyId || '',
    ownerId:user.uid, venueId:VENUE_ID, status:'PENDING', createdAt:serverTimestamp(),
  });
  return result.id;
}
export function subscribeToAssistanceRequests(callback, onError, ownerId) {
  const source = ownerId ? query(requests, where('ownerId', '==', ownerId)) : requests;
  return onSnapshot(source, s => callback(s.docs.map(d => ({ id:d.id,...d.data() })).sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))), onError);
}
export async function updateAssistanceStatus(id, status = 'ACCEPTED') {
  const user = await requireStaff();
  await runTransaction(db, async transaction => {
    const ref = doc(requests,id);
    const old = await transaction.get(ref);
    if (!old.exists() || !validTransition(old.data().status,status)) throw new Error('This request changed. Refresh its status before continuing.');
    const fields = {status,updatedBy:user.uid,statusUpdatedAt:serverTimestamp()};
    if (status === 'ACCEPTED') Object.assign(fields,{acceptedBy:user.uid,acceptedAt:serverTimestamp()});
    transaction.update(ref,fields);
    transaction.set(doc(collection(db,'venues',VENUE_ID,'activityLogs')), {text:`${old.data().type}: ${status} at ${old.data().location}`,actor:user.uid,createdAt:serverTimestamp()});
  });
}
