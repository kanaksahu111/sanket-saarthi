import { addDoc, collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const fallbackRequests = [
  { id: "req-1", user: "Ramesh Kumar", location: "Entrance Gate 1", type: "Wheelchair Assistance", status: "PENDING", time: "2 mins ago" },
  { id: "req-2", user: "Priya Sharma", location: "Platform 3 Lift", type: "Visual Guide Support", status: "IN_PROGRESS", time: "10 mins ago" }
];

let localRequestsStore = [...fallbackRequests];
let listeners = [];

const notifyListeners = () => {
  listeners.forEach(cb => cb([...localRequestsStore]));
};

const assistanceCollection = collection(db, "assistanceRequests");

export const createAssistanceRequest = async (request) => {
  const newReq = {
    id: `req-${Date.now()}`,
    ...request,
    status: "PENDING",
    time: "Just now"
  };

  try {
    const docRef = await addDoc(assistanceCollection, {
      ...request,
      status: "PENDING",
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    console.warn("Firebase create request failed, storing locally:", err);
    localRequestsStore = [newReq, ...localRequestsStore];
    notifyListeners();
    return newReq.id;
  }
};

export const subscribeToAssistanceRequests = (callback) => {
  listeners.push(callback);

  try {
    const unsub = onSnapshot(
      assistanceCollection,
      (snapshot) => {
        const requests = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        if (requests.length > 0) {
          localRequestsStore = requests;
        }
        callback(localRequestsStore);
      },
      (error) => {
        console.warn("Firebase subscription error, using local fallback:", error);
        callback(localRequestsStore);
      }
    );
    return unsub;
  } catch (err) {
    console.warn("Firebase unavailable, falling back:", err);
    callback(localRequestsStore);
    return () => {
      listeners = listeners.filter(cb => cb !== callback);
    };
  }
};

export const updateAssistanceStatus = async (requestId, status) => {
  localRequestsStore = localRequestsStore.map(r => r.id === requestId ? { ...r, status } : r);
  notifyListeners();

  try {
    const requestRef = doc(db, "assistanceRequests", requestId);
    await updateDoc(requestRef, { status });
  } catch (err) {
    console.warn("Firebase update status error:", err);
  }
};