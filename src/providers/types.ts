/**
 * * _alpha:_ **heading** - think compass direction
 * * _beta:_ **pitch** - front-to-back tilt (portrait)
 * * _gamma:_ **roll** - left-to-right tilt (landscape)
 */
export type DeviceOrientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

export type SensorsData = {
  orientation: DeviceOrientation;
  location: {
    coords: GeolocationPosition["coords"];
    compass: number;
  };
};

export const defaultCoords: GeolocationPosition["coords"] = {
  latitude: 0,
  longitude: 0,
  accuracy: 0,
  altitude: 0,
  altitudeAccuracy: 0,
  heading: 0,
  speed: 0,
};
