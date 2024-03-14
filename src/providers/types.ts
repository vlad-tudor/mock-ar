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
