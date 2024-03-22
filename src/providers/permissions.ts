import { PermissionState } from "./appConstants";

/**
 * Checks whether the device is capable of providing all required app data
 * @returns boolean
 */
const checkDeviceCapabilities = () => {
  // @ts-ignore
  const orientation = typeof DeviceOrientationEvent.requestPermission === "function";

  return orientation;
};

/**
 * Asks the user to allow for device orientation events to be read.
 * Needs to be executed as a consequence of button press.
 * Used for the gyro provider.
 */
const requestDeviceOrientation = async (): Promise<boolean> => {
  // @ts-ignore
  if (typeof DeviceOrientationEvent.requestPermission !== "function") {
    return false;
  }
  try {
    // @ts-ignore
    const permissionState = await DeviceOrientationEvent.requestPermission();
    return permissionState === PermissionState.Granted;
  } catch (error) {
    // TODO: more complex logic explaining to the user why app won't run
    console.error("Permission request denied:", error);
    return false;
  }
};

const requestLocation = async (): Promise<boolean> => {
  if (!("geolocation" in navigator)) {
    return false;
  }
  try {
    // @ts-ignore
    const permissionState = await navigator.permissions.query({ name: "geolocation" });
    return permissionState.state === PermissionState.Granted;
  } catch (error) {
    console.error("Permission request denied:", error);
    return false;
  }
};

/**
 * Attaches a click event listener to an  button,
 * which will sequentially request all app permissions when clicked.
 * TODO: maybe return the permissions instead of a boolean? (for logging)
 * TODO: maybe save to local storage?
 */
export const attachPermissionsGetter = async (element: HTMLElement): Promise<boolean> => {
  if (!checkDeviceCapabilities()) {
    return false;
  }

  const waitForUserAction = new Promise<boolean>((resolve) => {
    const onButtonClick = async () => {
      // add other permission requests here
      const deviceOrientationPermission = await requestDeviceOrientation();
      const deviceLocationPermission = await requestLocation();

      element.removeEventListener("click", onButtonClick);
      resolve(deviceOrientationPermission && deviceLocationPermission);
    };
    element.addEventListener("click", onButtonClick);
  });

  return waitForUserAction;
};
