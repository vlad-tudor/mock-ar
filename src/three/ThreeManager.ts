import {
  AmbientLight,
  DirectionalLight,
  MathUtils,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { AnimationManager } from "../managers/AnimationManager";
import { CameraOptions, SceneCamera } from "./types";

/**
 * Manages the cameras and rendering for the scene.
 */
export class ThreeManager {
  private overlay: HTMLElement;
  private dimensions: [width: number, height: number] = [0, 0];

  private perspective: SceneCamera;

  private renderer = new WebGLRenderer({ alpha: true });
  private animationManager = new AnimationManager();

  /**
   * Constructs a new CameraManager instance.
   * @param container - The HTML element that will contain the rendered scene.
   */
  constructor(container: HTMLElement, overlay: HTMLElement) {
    this.overlay = overlay;

    const [width, height] = [container.offsetWidth, container.offsetHeight];
    this.dimensions = [width, height];

    this.perspective = this.createPerspectiveCamera();

    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    this.animationManager.addCallback(this.animationManagerCallback.bind(this));

    this.addAmbientLight();
  }

  private animationManagerCallback() {
    this.renderer.render(this.perspective.scene, this.perspective.camera);
  }

  private createPerspectiveCamera(): SceneCamera {
    const [width, height] = this.dimensions;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    return { camera, scene };
  }

  private addAmbientLight() {
    const ambientLight = new AmbientLight(0xffffff, 0.5); // soft white light
    const directionalLight = new DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 1, 1); // position the light, maybe change to the position of the camera? Or  somewhere above?
    this.sceneAdd(ambientLight, directionalLight);
  }

  /**
   * Adds a callback function to the animation manager.
   * @param callback - The callback function to be added.
   */
  public addAnimationCallback(callback: () => void) {
    this.animationManager.addCallback(callback);
  }

  public startAnimation() {
    this.animationManager.start();
  }

  /**
   * Sets the quaternion for both the perspective and orthographic cameras.
   * @param quaternion - The quaternion to set.
   */
  public setCameraQuaternion(quaternion: Quaternion) {
    this.perspective.camera.quaternion.copy(quaternion);
  }

  /**
   * Sets the camera options for both the perspective and orthographic cameras.
   * @param options - The camera options to set.
   */
  public setCameraOptions({ cameraPosition, cameraRotation }: Partial<CameraOptions>) {
    if (cameraPosition) {
      this.perspective.camera.position.set(...cameraPosition);
    }
    if (cameraRotation) {
      this.perspective.camera.rotation.set(...cameraRotation);
    }
  }

  /**
   * Adds objects to both the perspective and orthographic scenes.
   * @param objects - The objects to add.
   */
  public sceneAdd(...objects: Object3D<Object3DEventMap>[]) {
    this.perspective.scene.add(...objects);
  }

  // OVERLAY STUFF - move to a separate class

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

  /**
   *
   * @param object3D
   * @param rotationOffset in radians. Get from Sensor PRovider
   */
  public updateOverlayForObject(object3D: Object3D, rotationOffset: number) {
    const vector = new Vector3();
    object3D.getWorldPosition(vector);
    vector.project(this.perspective.camera);

    const x = (0.5 + vector.x * 0.5) * this.dimensions[0];
    const y = (0.5 - vector.y * 0.5) * this.dimensions[1];

    if (vector.z > 1) {
      return;
    }

    let element = document.getElementById(object3D.uuid);

    if (!element) {
      element = this.createCircleOverlayElement(object3D.uuid, "lightgreen", 20);
      element.id = object3D.uuid;
      this.overlay.appendChild(element);
    }

    // Update the HTML element's position
    element.style.position = "absolute";
    element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

    // rotate element to face the camera
    element.style.transform += `rotate(${this.perspective.camera.rotation.z + rotationOffset}rad)`;
  }

  // TODO: move this to a separate class, to manage colours and stuff
  private createCircleOverlayElement(id: string, color: string, radius: number) {
    const circle = document.createElement("div");
    circle.id = id;
    circle.style.position = "absolute";
    circle.style.width = `${radius}px`;
    circle.style.height = `${radius}px`;
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = color;
    return circle;
  }
}
