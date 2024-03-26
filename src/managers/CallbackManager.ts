/**
 * BasicListener -- to be extended by other classes
 * which can run callbacks when a certain something occurs.
 * Maybe
 */
export class CallbackManager {
  private callbacks: Array<() => void> = [];

  public addCallback(callback: () => void) {
    return this.callbacks.push(callback);
  }

  public removeCallbackByIndex(index: number) {
    return this.callbacks.splice(index, 1);
  }

  public removeCallback(callback: () => void) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  public runCallbacks() {
    this.callbacks.forEach((callback) => callback());
  }

  public removeAllCallbacks() {
    this.callbacks = [];
  }
}
