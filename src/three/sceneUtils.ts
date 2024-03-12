import { AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from "three";

import { CameraOptions } from "./types";
import { AnimationManager } from "./AnimationManager";

/**
 * @param container where the three scene will be attached
 * @param { CameraOptions } cameraOptions initial camera options
 */
export function initialiseScene(
  container: HTMLElement,
  { cameraRotation, cameraPosition }: CameraOptions
) {
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  const scene = new Scene();

  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(...cameraPosition);
  camera.rotation.set(...cameraRotation);

  const renderer = new WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const animationManager = new AnimationManager();

  animationManager.addCallback(() => renderer.render(scene, camera));

  return { animationManager, scene, camera };
}

/**
 * Adds lighting to a scene. Maybe we should toggle it?
 * TODO: Evolve into more complex lighting
 */
export const createAmbientLight = () => {
  const ambientLight = new AmbientLight(0xffffff, 0.5); // soft white light
  const directionalLight = new DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(1, 1, 1); // position the light, maybe change to the position of the camera? Or  somewhere above?

  // scene.add(ambientLight, directionalLight);
  return [
    (scene: Scene) => {
      scene.add(ambientLight);
      scene.add(directionalLight);
    },
    (scene: Scene) => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    },
  ];
};
