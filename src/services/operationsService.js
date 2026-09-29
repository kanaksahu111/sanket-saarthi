import { collection, doc, runTransaction, serverTimestamp, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { requireStaff } from './authService';
import { FACILITIES, TRAIN_ID, VENUE_ID, VENUE_NAME, platformNumber } from '../data/journey';
const activity = collection(db, 'venues', VENUE_ID, 'activityLogs');
export async function changeOperation(kind, id, field, value, expected) {
  const user = await requireStaff();
  if (kind === 'trains') value = platformNumber(value);
  else if (!['OPERATIONAL', 'UNAVAILABLE', 'MAINTENANCE'].includes(value)) throw new Error('Invalid facility status.');
  const ref = doc(db, 'venues', VENUE_ID, kind, id);
  await runTransaction(db, async transaction => {
    const old = await transaction.get(ref);
    if (!old.exists()) throw new Error('Initialize the demo records first.');
    if (old.data()[field] !== expected) throw new Error('This record changed. Review the latest value and try again.');
    transaction.update(ref, { [field]: value, updatedAt: serverTimestamp() });
    transaction.set(doc(activity), { text: `${old.data().name || id}: ${expected} → ${value}`, actor: user.uid, createdAt: serverTimestamp() });
  });
}
export async function initializeDemo(reset = false) {
  const user = await requireStaff();
  const records = [
    [doc(db, 'venues', VENUE_ID), { name: VENUE_NAME, demo: true }],
    [doc(db, 'venues', VENUE_ID, 'trains', TRAIN_ID), { name: '12345 Express', number: '12345', platform: 3, status: 'On Time' }],
    ...FACILITIES.map(f => [doc(db, 'venues', VENUE_ID, 'facilities', f.id), { ...f, status: 'OPERATIONAL' }]),
  ];
  await runTransaction(db, async transaction => {
    const snapshots = await Promise.all(records.map(([ref]) => transaction.get(ref)));
    records.forEach(([ref, data], i) => { if (reset || !snapshots[i].exists()) transaction.set(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true }); });
    transaction.set(doc(activity), { text: reset ? 'Demo reset: Platform 3; facilities operational.' : 'Missing demo records initialized.', actor: user.uid, createdAt: serverTimestamp() });
  });
}
export function subscribeActivity(callback, onError) {
  return onSnapshot(query(activity, orderBy('createdAt', 'desc'), limit(20)), s => callback(s.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
}
