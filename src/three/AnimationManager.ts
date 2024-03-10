/**
 * Class to manage the animation loop.
 */
class AnimationManager {
  private animationId: number = 0;
  private running: boolean = true;
  private callbacks: (() => void)[] = [];

  private animate = () => {
    if (!this.running) return;
    this.animationId = requestAnimationFrame(this.animate);
    this.callbacks.forEach((callback) => callback());
  };

  public start() {
    this.running = true;
    this.animate();
  }

  public stop() {
    this.running = false;
    cancelAnimationFrame(this.animationId);
  }

  public addCallback(callback: () => void) {
    this.callbacks.push(callback);
  }

  public removeCallback(callback: () => void) {
    const index = this.callbacks.indexOf(callback);
    if (index !== -1) {
      this.callbacks.splice(index, 1);
    }
  }
}
