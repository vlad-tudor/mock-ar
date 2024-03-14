import { GyroProvider } from "../providers/GyroProvider";
import { generateCubesGrid } from "./objectUtils";
import { orientationToQuaternion } from "./quaternions";
import { createAmbientLight, initialiseScene } from "./sceneUtils";

/**
 * Starts the app
 * Contains setup & render loop
 * @param { HTMLElement} container - the container for the app
 */
export const startThreeApp = (container: HTMLElement) => {
  const [addLight] = createAmbientLight();
  const { scene, animationManager, camera } = initialiseScene(container, {
    cameraPosition: [0, 0, 10], // camera pointing down
    cameraRotation: [0, 0, 0],
  });

  // lighting
  addLight(scene);

  // cubes/objects
  const cubes = generateCubesGrid(20, -0, 3);
  scene.add(...cubes);

  // render loop
  const render = () => {
    // changing the camera orientation based on the device orientation
    camera.quaternion.copy(orientationToQuaternion(GyroProvider.rawValues));

    // animating the cubes
    cubes.forEach((cube) => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
  };

  animationManager.addCallback(render);
  animationManager.start();
};
