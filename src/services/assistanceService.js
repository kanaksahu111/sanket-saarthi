import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

const assistanceCollection = collection(db, "assistanceRequests");

// Create a new assistance request
export const createAssistanceRequest = async (request) => {
  const docRef = await addDoc(assistanceCollection, {
    ...request,
    status: "PENDING",
  });

  return docRef.id;
};

// Listen for all assistance requests in realtime
export const subscribeToAssistanceRequests = (callback) => {
  return onSnapshot(assistanceCollection, (snapshot) => {
    const requests = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    callback(requests);
  });
};

// Update an assistance request's status
export const updateAssistanceStatus = async (requestId, status) => {
  const requestRef = doc(db, "assistanceRequests", requestId);

  await updateDoc(requestRef, {
    status,
  });
};