import { EnuCoordinate, GpsLocation } from "../types";

const earthRadius = 6378137; // Earth's radius
const eccentricity = 8.1819190842622e-2; // Eccentricity

/**
 * Converts GPS coordinates to Earth-Centered, Earth-Fixed (ECEF) coordinates.
 * @param location The GPS location to convert.
 * @returns The ECEF coordinates [x, y, z].
 */
function gpsToEcef(location: GpsLocation): EnuCoordinate {
  const { longitude, latitude, altitude } = location;

  const primeVerticalRadius =
    earthRadius /
    Math.sqrt(1 - eccentricity * eccentricity * Math.sin((latitude * Math.PI) / 180) ** 2);

  const cosLatitude = Math.cos((latitude * Math.PI) / 180);
  const sinLatitude = Math.sin((latitude * Math.PI) / 180);
  const cosLongitude = Math.cos((longitude * Math.PI) / 180);
  const sinLongitude = Math.sin((longitude * Math.PI) / 180);

  const x = (primeVerticalRadius + altitude) * cosLatitude * cosLongitude;
  const y = (primeVerticalRadius + altitude) * cosLatitude * sinLongitude;
  const z = (primeVerticalRadius * (1 - eccentricity * eccentricity) + altitude) * sinLatitude;

  return [x, y, z];
}

/**
 * Converts Earth-Centered, Earth-Fixed (ECEF) coordinates to East-North-Up (ENU) coordinates.
 * @param ecefObject The ECEF coordinates [x, y, z] to convert.
 * @param ecefReference The ECEF reference coordinates [x, y, z].
 * @param referenceLocation The reference GPS location.
 * @returns The ENU coordinates [e, n, u].
 */
function ecefToEnu(
  ecefObject: EnuCoordinate,
  ecefReference: EnuCoordinate,
  referenceLocation: GpsLocation
): EnuCoordinate {
  const { longitude, latitude } = referenceLocation;
  const [dx, dy, dz] = ecefObject.map((coord, index) => coord - ecefReference[index]);

  // Convert latitude and longitude to radians
  const sinLat = Math.sin((latitude * Math.PI) / 180);
  const cosLat = Math.cos((latitude * Math.PI) / 180);
  const sinLng = Math.sin((longitude * Math.PI) / 180);
  const cosLng = Math.cos((longitude * Math.PI) / 180);

  // Calculate ENU coordinates
  const east = -sinLng * dx + cosLng * dy;
  const north = -sinLat * cosLng * dx - sinLat * sinLng * dy + cosLat * dz;
  const up = cosLat * cosLng * dx + cosLat * sinLng * dy + sinLat * dz;

  return [east, north, up];
}

/**
 * Scales the East-North-Up (ENU) coordinates by a given scale factor.
 * @param enu The ENU coordinates [e, n, u] to scale.
 * @param scale The scale factor to apply (default is 1).
 * @returns The scaled ENU coordinates [e, n, u].
 */
function scaleEnu(enu: EnuCoordinate, scale: number = 1): EnuCoordinate {
  return enu.map((coord) => coord * scale) as EnuCoordinate;
}

/**
 * Converts GPS coordinates to Three.js coordinates using the Earth-Centered, Earth-Fixed (ECEF) coordinate system.
 * @param currentLocation The current GPS location.
 * @param objectLocation The GPS location of the object.
 * @param scale The scale factor to apply (default is 1).
 * @returns The Three.js coordinates [x, y, z].
 */
export function convertGpsToThreeJsCoordinates(
  currentLocation: GpsLocation,
  objectLocation: GpsLocation,
  scale: number = 1
): EnuCoordinate {
  // Convert current location and object location to ECEF coordinates
  const ecefReference = gpsToEcef(currentLocation);
  const ecefObject = gpsToEcef(objectLocation);

  // Convert ECEF coordinates to East-North-Up (ENU) coordinates
  const enuObject = ecefToEnu(ecefObject, ecefReference, currentLocation);

  // Scale the ENU coordinates
  const scaledEnuObject = scaleEnu(enuObject, scale);
  return scaledEnuObject;
}
