import { GyroProvider } from "../providers/GyroProvider";
import { createCube } from "./objectUtils";
import { createAmbientLight, initialiseScene } from "./sceneUtils";

/**
 * Starts the app
 * @param { HTMLElement} container - the container for the app
 */
export const startThreeApp = (container: HTMLElement) => {
  const [addLight] = createAmbientLight();
  const { scene, animationManager } = initialiseScene(container, {
    cameraPosition: [0, 0, 5],
    cameraRotation: [0, 0, 0],
  });

  const cube = createCube([0, 0, -3]);
  scene.add(cube);
  addLight(scene);

  const animateCube = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  animationManager.addCallback(animateCube);
  animationManager.start();
};
