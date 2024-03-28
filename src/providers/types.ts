import { GpsLocation } from "../three/types";

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
    coords: GpsLocation;
    compass: number;
  };
};

export const defaultCoords: GpsLocation = {
  latitude: 0,
  longitude: 0,
  altitude: 0,
};
