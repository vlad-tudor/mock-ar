import { CallbackManager } from "./CallbackManager";

/**
 * * _alpha:_ **heading** - think compass direction
 * * _beta:_ **pitch** - front-to-back tilt (portrait)
 * * _gamma:_ **roll** - left-to-right tilt (landscape)
 */
type DeviceOrientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

/**
 * Cute state encapsulation for the device orientation
 */
export class GyroProvider {
  private static alpha: number = 0;
  private static beta: number = 0;
  private static gamma: number = 0;

  private static callbackManager = new CallbackManager();

  public static addCallback(callback: () => void) {
    GyroProvider.callbackManager.addCallback(callback);
  }

  /**
   * NOTE: permissions are checked before this method is called
   * TODO: maybe pass in permissions as an argument?
   */
  public static start() {
    GyroProvider.updateOrientation = GyroProvider.updateOrientation.bind(GyroProvider);
    window.addEventListener("deviceorientation", GyroProvider.updateOrientation);
  }

  /**
   * Remove the event listener & reset the state
   */
  public static destroy() {
    window.removeEventListener("deviceorientation", GyroProvider.updateOrientation);

    // clear the state
    GyroProvider.alpha = 0;
    GyroProvider.beta = 0;
    GyroProvider.gamma = 0;
  }

  /**
   * Update the latest known orientation values
   * TODO: could be an 'average' since values are last accessed?
   * -- maybe instantiating the class could give access to the average?
   */
  private static updateOrientation(event: DeviceOrientationEvent) {
    GyroProvider.alpha = event.alpha ?? GyroProvider.alpha;
    GyroProvider.beta = event.beta ?? GyroProvider.beta;
    GyroProvider.gamma = event.gamma ?? GyroProvider.gamma;

    GyroProvider.callbackManager.runCallbacks();
  }

  public static get rawValues(): DeviceOrientation {
    return {
      alpha: this.alpha,
      beta: this.beta,
      gamma: this.gamma,
    };
  }
}
