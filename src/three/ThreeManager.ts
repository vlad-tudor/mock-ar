import {
  AmbientLight,
  DirectionalLight,
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
  private dimensions: [width: number, height: number] = [0, 0];

  private perspective: SceneCamera<PerspectiveCamera>;

  private renderer = new WebGLRenderer({ alpha: true });
  private animationManager = new AnimationManager();

  /**
   * Constructs a new CameraManager instance.
   * @param container - The HTML element that will contain the rendered scene.
   */
  constructor(container: HTMLElement) {
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

  private createPerspectiveCamera(): SceneCamera<PerspectiveCamera> {
    const [width, height] = this.dimensions;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 100000);
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

  public get camera() {
    return this.perspective.camera;
  }
}
