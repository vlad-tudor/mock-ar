export type XYZ = [x: number, y: number, z: number];
export type CameraOptions = { cameraRotation: XYZ; cameraPosition: XYZ };

export type GpsLocation = {
  longitude: number; // Longitude
  latitude: number; // Latitude
  altitude: number; // Altitude
};

export type EnuCoordinate = [east: number, north: number, up: number];
