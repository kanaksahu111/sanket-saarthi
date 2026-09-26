import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

const facilitiesCollection = collection(
  db,
  "venues",
  "central-station",
  "facilities"
);

// Get one facility's current information
export const getFacility = async (facilityId) => {
  const facilityRef = doc(facilitiesCollection, facilityId);
  const snapshot = await getDoc(facilityRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

// Listen for realtime changes to one facility
export const subscribeToFacility = (facilityId, callback) => {
  const facilityRef = doc(facilitiesCollection, facilityId);

  return onSnapshot(facilityRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback({
      id: snapshot.id,
      ...snapshot.data(),
    });
  });
};

// Update a facility's status
export const updateFacilityStatus = async (facilityId, status) => {
  const facilityRef = doc(facilitiesCollection, facilityId);

  await updateDoc(facilityRef, {
    status,
  });
};