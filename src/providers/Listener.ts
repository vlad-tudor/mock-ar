/**
 * BasicListener -- to be extended by other classes
 * which can run callbacks when a certain something occurs.
 * Maybe
 */
export class CallbackManager {
  private static callbacks: Array<() => void> = [];

  public static addCallback(callback: () => void) {
    return CallbackManager.callbacks.push(callback);
  }

  public static removeCallbackByIndex(index: number) {
    return CallbackManager.callbacks.splice(index, 1);
  }

  public static removeCallback(callback: () => void) {
    const index = CallbackManager.callbacks.indexOf(callback);
    if (index > -1) {
      CallbackManager.callbacks.splice(index, 1);
    }
  }

  public static runCallbacks() {
    CallbackManager.callbacks.forEach((callback) => callback());
  }

  public static removeAllCallbacks() {
    CallbackManager.callbacks = [];
  }
}
