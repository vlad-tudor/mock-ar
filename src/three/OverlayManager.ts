import { Object3D, PerspectiveCamera, Vector3 } from "three";

export class OverlayManager {
  private dimensions: [width: number, height: number] = [0, 0];
  private container: HTMLElement;
  private camera: PerspectiveCamera;

  constructor(container: HTMLElement, camera: PerspectiveCamera) {
    const [width, height] = [container.offsetWidth, container.offsetHeight];

    this.dimensions = [width, height];
    this.container = container;
    this.camera = camera;
  }

  private findOrCreateCircleOverlayElement(uuid: string, colour: string, radius = 20) {
    let element = document.getElementById(uuid);
    if (!element) {
      element = document.createElement("div");
      element.id = uuid;
      element.style.position = "absolute";
      element.style.width = `${radius}px`;
      element.style.height = `${radius}px`;
      element.style.borderRadius = "50%";
      this.container.appendChild(element);
    }

    element.style.backgroundColor = colour;
    return element;
  }

  /**
   *
   * @param object3D
   * @param rotationOffset in radians. Get from Sensor PRovider
   */

  public updateOverlayForObjects(objects: Object3D[], rotationOffset: number) {
    for (const object of objects) {
      this.updateOverlayForObject(object, rotationOffset);
    }
  }

  public updateOverlayForObject(object3D: Object3D, rotationOffset?: number) {
    const vector = new Vector3();
    object3D.getWorldPosition(vector);
    vector.project(this.camera);

    const isInView =
      vector.z <= 1 && vector.x >= -1 && vector.x <= 1 && vector.y >= -1 && vector.y <= 1;

    let screenX = (0.5 + vector.x * 0.5) * this.dimensions[0];
    let screenY = (0.5 - vector.y * 0.5) * this.dimensions[1];

    if (!isInView) {
      // Calculate the direction from the center of the screen to the object
      const dir = vector.clone().sub(new Vector3(0, 0, 1)).normalize();
      const m = dir.y / dir.x;

      // Find the intersection with the screen bounds
      if (Math.abs(dir.x) > Math.abs(dir.y)) {
        // Intersect with left or right screen edge
        const newX = dir.x > 0 ? this.dimensions[0] : 0;
        const newY = m * (newX - this.dimensions[0] / 2) + this.dimensions[1] / 2;
        screenX = newX;
        screenY = this.dimensions[1] - Math.max(Math.min(newY, this.dimensions[1]), 0);
      } else {
        // Intersect with top or bottom screen edge
        const newY = dir.y > 0 ? 0 : this.dimensions[1];
        const newX = (newY - this.dimensions[1] / 2) / m + this.dimensions[0] / 2;
        screenX = this.dimensions[0] - Math.max(Math.min(newX, this.dimensions[0]), 0);
        screenY = newY;
      }
    }

    const element = this.findOrCreateCircleOverlayElement(
      object3D.uuid,
      isInView ? "lightgreen" : "red"
    );

    element.style.transform = `translate(-50%, -50%) translate(${screenX}px,${screenY}px)`;

    if (rotationOffset) {
      element.style.transform += `rotate(${this.camera.rotation.z + rotationOffset}rad)`;
    }
  }
}
