import { CallbackManager } from "./CallbackManager";

/**
 * Class to manage the animation loop.
 */
export class AnimationManager extends CallbackManager {
  private animationId: number = 0;
  private running: boolean = true;

  private animate = () => {
    if (!this.running) return;
    this.animationId = requestAnimationFrame(this.animate);
    this.runCallbacks();
  };

  public start() {
    this.running = true;
    this.animate();
  }

  public stop() {
    this.running = false;
    cancelAnimationFrame(this.animationId);
  }
}
