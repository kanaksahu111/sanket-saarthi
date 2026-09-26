import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { getCityVenue, getCityVenueList, CITY_VENUES_MULTIPLE } from "./cityDataService";

export { CITY_VENUES_MULTIPLE as VENUE_TYPES };

export const getVenueDataList = (cityId = "mumbai", placeId = "railway") => {
  return getCityVenueList(cityId, placeId);
};

export const getVenueData = (cityId = "mumbai", placeId = "railway", venueId = null) => {
  return getCityVenue(cityId, placeId, venueId);
};

export const subscribeToVenue = (cityId = "mumbai", placeId = "railway", callback, venueId = null) => {
  const venueObj = getVenueData(cityId, placeId, venueId);
  const venueKey = `${cityId}-${placeId}-${venueObj.id}`;
  const venueRef = doc(collection(db, "venues"), venueKey);

  try {
    return onSnapshot(
      venueRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          callback(venueObj);
          return;
        }
        callback({ id: snapshot.id, ...snapshot.data() });
      },
      (error) => {
        console.warn(`Firebase venue sub error for ${venueKey}, using local city data:`, error);
        callback(venueObj);
      }
    );
  } catch (err) {
    console.warn("Firebase unavailable, returning fallback city venue data:", err);
    callback(venueObj);
    return () => {};
  }
};

export const updateVenueTarget = async (cityId = "mumbai", placeId = "railway", targetValue, venueId = null) => {
  try {
    const venueObj = getVenueData(cityId, placeId, venueId);
    const venueKey = `${cityId}-${placeId}-${venueObj.id}`;
    const venueRef = doc(collection(db, "venues"), venueKey);
    await updateDoc(venueRef, { targetValue });
  } catch (err) {
    console.warn("Firebase venue update error:", err);
  }
};