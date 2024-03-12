import { GyroProvider } from "../providers/GyroProvider";
import { generateCubesGrid } from "./objectUtils";
import { createAmbientLight, initialiseScene } from "./sceneUtils";

/**
 * Starts the app
 * Contains setup & render loop
 * @param { HTMLElement} container - the container for the app
 */
export const startThreeApp = (container: HTMLElement) => {
  const [addLight] = createAmbientLight();
  const { scene, animationManager } = initialiseScene(container, {
    cameraPosition: [0, 0, 15], // camera pointing down
    cameraRotation: [0, 0, 0],
  });

  // lighting
  addLight(scene);

  // cubes/objects
  const cubes = generateCubesGrid(10, -0, 2);
  scene.add(...cubes);

  // render loop
  const render = () => {
    const { alpha, beta, gamma } = GyroProvider.rawValues;

    // animating the camera
    scene.rotation.x = beta * -(Math.PI / 180);
    scene.rotation.y = gamma * -(Math.PI / 180);
    scene.rotation.z = alpha * -(Math.PI / 180);

    // animating the cubes
    cubes.forEach((cube) => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
  };

  animationManager.addCallback(render);
  animationManager.start();
};
