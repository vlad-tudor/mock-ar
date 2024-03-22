import { Euler, MathUtils, Quaternion, Vector3 } from "three";
import { DeviceOrientation } from "../providers/types";

/**
 * Turn the device orientation into a Quaternion
 * NOTE: The 'ZXY' order is used for converting device orientation to Three.js Euler angles
 * -- the order is important for the conversion to work correctly!
 * TODO: assess whether this could just be moved to GyroProvider instead.
 */
export const orientationToQuaternion = ({ alpha, beta, gamma }: DeviceOrientation): Quaternion => {
  // Convert degrees to radians
  const alphaRad = MathUtils.degToRad(alpha);
  const betaRad = MathUtils.degToRad(beta);
  const gammaRad = MathUtils.degToRad(gamma);

  // Create Euler angles from the device orientation
  // Note: The 'ZXY' order is used for converting device orientation to Three.js Euler angles
  const euler = new Euler(betaRad, gammaRad, alphaRad, "ZXY");
  // Convert Euler angles to Quaternion
  return new Quaternion().setFromEuler(euler);
};

/**
 * Checks whether the device is in an orientation which allows 'calibration'
 * this is in t
 */
export const ableToCalibrate = (orientation: DeviceOrientation, degreesThreshold = 3): boolean => {
  return Math.abs(orientation.beta) < 3 && Math.abs(orientation.gamma) <= degreesThreshold;
};
