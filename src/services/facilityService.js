import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const fallbackFacilities = {
  "lift-a": { id: "lift-a", name: "Lift A", status: "available", location: "Main Concourse", stepFree: true },
  "lift-b": { id: "lift-b", name: "Lift B", status: "available", location: "Platform 5 Corridor", stepFree: true },
  "ramp-b": { id: "ramp-b", name: "Ramp B", status: "available", location: "Entrance Gate 2", stepFree: true },
  "escalator-1": { id: "escalator-1", name: "Escalator 1", status: "available", location: "Platform 1 Access", stepFree: false }
};

const facilitiesCollection = collection(db, "venues", "central-station", "facilities");

export const getFacility = async (facilityId = "lift-a") => {
  try {
    const facilityRef = doc(facilitiesCollection, facilityId);
    const snapshot = await getDoc(facilityRef);
    if (!snapshot.exists()) return fallbackFacilities[facilityId] || null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (err) {
    console.warn("Firebase facility get error, using fallback:", err);
    return fallbackFacilities[facilityId] || null;
  }
};

export const subscribeToFacility = (facilityId = "lift-a", callback) => {
  try {
    const facilityRef = doc(facilitiesCollection, facilityId);
    return onSnapshot(
      facilityRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          callback(fallbackFacilities[facilityId] || null);
          return;
        }
        callback({ id: snapshot.id, ...snapshot.data() });
      },
      (error) => {
        console.warn("Firebase facility subscription error, using fallback:", error);
        callback(fallbackFacilities[facilityId] || null);
      }
    );
  } catch (err) {
    console.warn("Firebase unavailable, falling back:", err);
    callback(fallbackFacilities[facilityId] || null);
    return () => {};
  }
};

export const updateFacilityStatus = async (facilityId, status) => {
  try {
    const facilityRef = doc(facilitiesCollection, facilityId);
    await updateDoc(facilityRef, { status });
  } catch (err) {
    console.warn("Firebase facility update error:", err);
  }
};