import { GpsLocation } from "../three/types";
import { customFetch } from "./fetchUtils";

// Base URL for the API
const baseUrl = "https://api.n2yo.com/rest/v1/satellite";

// Your API key
const API_KEY = import.meta.env.VITE_N2YO_API_KEY;

type NoradId = GpsLocation & {
  noradId: number;
};

type RadioPassesParam = NoradId &
  GpsLocation & {
    days: number;
    minElevation: number;
  };

type SatellitePositionsParam = NoradId & GpsLocation & { seconds: number };
type WhatsUpParam = GpsLocation & {
  searchRadius: number;
  category_id: number;
};

/**
 * Get the Two Line Elements (TLE) for a satellite.
 * @param {number} noradId - The NORAD id of the satellite.
 */
function getSatelliteTLE({ noradId }: NoradId) {
  const url = `${baseUrl}/tle/${noradId}&apiKey=${API_KEY}`;
  return customFetch(url);
}

/**
 * Get radio passes for a satellite relative to an observer's location.
 */
async function getRadioPasses(args: RadioPassesParam) {
  const { noradId, latitude, longitude, altitude, days, minElevation } = args;
  const url = `${baseUrl}/radiopasses/${noradId}/${latitude}/${longitude}/${altitude}/${days}/${minElevation}/&apiKey=${API_KEY}`;
  return customFetch(url);
}

/**
 * Get the current position of a satellite.
 */
async function getSatellitePositions(args: SatellitePositionsParam) {
  const { noradId, latitude, longitude, altitude, seconds } = args;
  const url = `${baseUrl}/positions/${noradId}/${latitude}/${longitude}/${altitude}/${seconds}/&apiKey=${API_KEY}`;
  return customFetch(url);
}

/**
 * Get all objects within a given search radius above the observer's location.
 */
async function getWhatsUp(args: WhatsUpParam) {
  const { latitude, longitude, altitude, searchRadius, category_id } = args;
  const url = `${baseUrl}/above/${latitude}/${longitude}/${altitude}/${searchRadius}/${category_id}/&apiKey=${API_KEY}`;
  return customFetch(url);
}

// Example usage:
// getSatelliteTLE(25544); // Replace 25544 with your NORAD ID of interest
// getRadioPasses(25544, 41.702, -76.014, 0, 2, 40);
// getSatellitePositions(25544, 41.702, -76.014, 0, 90);
