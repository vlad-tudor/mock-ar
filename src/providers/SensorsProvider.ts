import { bearingOffset, bearingWrap } from "../utils";
import { CallbackManager } from "../managers/CallbackManager";
import { DeviceOrientation, SensorsData, defaultCoords } from "./types";

/**
 * Cute state encapsulation for the device orientation
 */
export class SensorsProvider {
  private static alpha: number = 0;
  private static beta: number = 0;
  private static gamma: number = 0;

  private static compass: number = 0;
  private static coords?: GeolocationPosition["coords"] = undefined;

  private static alphaOffset: number = 0;
  private static lastCalibrationTime: number | undefined;

  public static running = false;

  private static callbackManager = new CallbackManager();

  private static geolocationCallbackId: number | undefined;

  public static addCallback(callback: () => void) {
    SensorsProvider.callbackManager.addCallback(callback);
  }

  /**
   * NOTE: permissions are checked before this method is called
   * TODO: maybe pass in permissions as an argument?
   */
  public static start() {
    SensorsProvider.updateOrientation = SensorsProvider.updateOrientation.bind(SensorsProvider);
    SensorsProvider.updatePosition = SensorsProvider.updatePosition.bind(SensorsProvider);

    window.addEventListener("deviceorientation", SensorsProvider.updateOrientation);
    SensorsProvider.geolocationCallbackId = navigator.geolocation.watchPosition(
      SensorsProvider.updatePosition
    );
  }

  /**
   * Remove the event listener & reset the state
   */
  public static stop() {
    window.removeEventListener("deviceorientation", SensorsProvider.updateOrientation);

    if (SensorsProvider.geolocationCallbackId)
      navigator.geolocation.clearWatch(SensorsProvider.geolocationCallbackId);

    // clear the state
    SensorsProvider.alpha = 0;
    SensorsProvider.beta = 0;
    SensorsProvider.gamma = 0;
  }

  /**
   * Update the latest known orientation values
   * TODO: could be an 'average' since values are last accessed?
   * -- maybe instantiating the class could give access to the average?
   */
  private static updateOrientation(event: DeviceOrientationEvent) {
    if (!SensorsProvider.running) {
      SensorsProvider.running = true;
    }

    // TODO: write additional logic to support Android devices.
    // @ts-ignore
    SensorsProvider.compass = event.webkitCompassHeading ?? SensorsProvider.compass;
    SensorsProvider.alpha = event.alpha ?? SensorsProvider.alpha;
    SensorsProvider.beta = event.beta ?? SensorsProvider.beta;
    SensorsProvider.gamma = event.gamma ?? SensorsProvider.gamma;

    SensorsProvider.callbackManager.runCallbacks();
  }

  private static updatePosition(position: GeolocationPosition) {
    SensorsProvider.coords = position.coords;
  }

  /**
   * Calibrate the alpha value by setting the offset.
   * this way we're always orienting the camera to the same direction
   * with respect to the real world
   * @returns
   */
  public static calibrateAlpha() {
    const timeNow = Date.now();
    // only calibrate if we haven't calibrated in the last 3 seconds
    if (
      SensorsProvider.lastCalibrationTime &&
      timeNow - SensorsProvider.lastCalibrationTime < 3000
    ) {
      return;
    }

    SensorsProvider.alphaOffset = bearingOffset(
      -SensorsProvider.compass + 360,
      SensorsProvider.alpha
    );

    SensorsProvider.lastCalibrationTime = timeNow;
  }

  public static get offset(): DeviceOrientation {
    return { alpha: SensorsProvider.alphaOffset, beta: 0, gamma: 0 };
  }

  public static get rawValues(): SensorsData {
    return {
      orientation: {
        alpha: SensorsProvider.alpha,
        beta: SensorsProvider.beta,
        gamma: SensorsProvider.gamma,
      },
      location: {
        compass: SensorsProvider.compass,
        coords: SensorsProvider.coords ?? defaultCoords,
      },
    };
  }

  private static ableToCalibrate(degreesThreshold = 3): boolean {
    return (
      Math.abs(SensorsProvider.beta) < 3 && Math.abs(SensorsProvider.gamma) <= degreesThreshold
    );
  }

  // Todo: apply the alpha offset much slower here.
  // -- to avoid camera snapping around
  public static get values(): SensorsData {
    if (SensorsProvider.ableToCalibrate()) {
      SensorsProvider.calibrateAlpha();
    }

    return {
      orientation: {
        alpha: bearingWrap(SensorsProvider.alpha - SensorsProvider.alphaOffset),
        beta: SensorsProvider.beta,
        gamma: SensorsProvider.gamma,
      },
      location: {
        compass: SensorsProvider.compass,
        coords: SensorsProvider.coords ?? defaultCoords,
      },
    };
  }
}
