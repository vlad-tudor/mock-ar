import { MathUtils, Quaternion, Vector3 } from "three";
import { SensorsProvider } from "../providers/SensorsProvider";
import { createCube, createPlane, generateCompass, generateCubesGrid } from "./objectUtils";
import { ableToCalibrate, orientationToQuaternion } from "./quaternions";
import { createAmbientLight, initialiseScene } from "./sceneUtils";
import { convertGpsToThreeJsCoordinates } from "./locations";

/**
 * Starts the app
 * Contains setup & render loop
 * @param { HTMLElement} container - the container for the app
 */
export const startThreeApp = (container: HTMLElement) => {
  const [addLight] = createAmbientLight();
  const { scene, animationManager, camera } = initialiseScene(container, {
    cameraPosition: [0, 0, 20], // camera pointing down
    cameraRotation: [0, 0, 0],
  });

  // lighting
  addLight(scene);

  const compass = generateCompass(0, 0.3);
  const cube = createCube([0, 0, 0]);

  scene.add(compass, cube);
  const [lat, lng] = [51.56406705762348, -0.35443528946451613];

  // render loop
  const render = () => {
    const {
      orientation,
      location: { coords },
    } = SensorsProvider.values;
    if (ableToCalibrate(orientation)) {
      SensorsProvider.calibrateAlpha();
    }

    camera.quaternion.copy(orientationToQuaternion(orientation));

    const { longitude, latitude, altitude = 0 } = coords;
    console.info({ longitude, latitude, orientation });

    const locationNorth = {
      longitude: lng,
      latitude: lat, //latitude + 0.00005,
      altitude: (altitude || 0) + 0,
    };

    const cubePosition = convertGpsToThreeJsCoordinates(
      { latitude, longitude, altitude: altitude || 0 },
      locationNorth
    );
    cube.position.set(...cubePosition);
  };

  animationManager.addCallback(render);
  animationManager.start();
};
