import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

// Reference to the trains collection for our railway station
const trainsCollection = collection(
  db,
  "venues",
  "central-station",
  "trains"
);

// Get one train's current information
export const getTrain = async (trainId) => {
  const trainRef = doc(trainsCollection, trainId);
  const snapshot = await getDoc(trainRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

// Listen for realtime changes to one train
export const subscribeToTrain = (trainId, callback) => {
  const trainRef = doc(trainsCollection, trainId);

  return onSnapshot(trainRef, (snapshot) => {
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

// Update a train's platform
export const updateTrainPlatform = async (trainId, platform) => {
  const trainRef = doc(trainsCollection, trainId);

  await updateDoc(trainRef, {
    platform,
  });
};