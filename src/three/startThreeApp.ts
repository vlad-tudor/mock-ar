import { SensorsProvider } from "../providers/SensorsProvider";
import { createSpriteAtLocation, generateCompass } from "./utils/objectCreators";
import { ableToCalibrate, orientationToQuaternion } from "./utils/deviceOrientationUtils";
import { createAmbientLight, initialiseScene } from "./utils/sceneUtils";
import { convertGpsToThreeJsCoordinates } from "./utils/locations";
import planePath from "../../assets/realistic-plane.png";
import { scaleSpritesForConsistentSize } from "./utils/objectUtils";
import { Sprite } from "three";

/**
 * Starts the app
 * Contains setup & render loop
 * @param { HTMLElement} container - the container for the app
 */
export const startThreeApp = async (container: HTMLElement) => {
  try {
    const [addLight] = createAmbientLight();
    const { scene, animationManager, camera } = initialiseScene(container, {
      cameraPosition: [0, 0, 20], // camera pointing down
      cameraRotation: [0, 0, 0],
    });

    // lighting
    addLight(scene);

    // OBJECTS
    const compass = generateCompass(0, 0.3);
    const plane = createSpriteAtLocation(planePath, 0, 0, 0);

    const [lat, lng] = [51.566377178238845, -0.35709750241636024];

    const planeSprites: Sprite[] = [plane];

    scene.add(compass, ...planeSprites);
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

      const locationNorth = {
        longitude: lng,
        latitude: lat, //latitude + 0.00005,
        altitude: (altitude || 0) + 0,
      };

      const newPosition = convertGpsToThreeJsCoordinates(
        { latitude, longitude, altitude: altitude || 0 },
        locationNorth
      );

      scaleSpritesForConsistentSize(planeSprites, camera);
      plane.position.set(...newPosition);
    };

    animationManager.addCallback(render);
    animationManager.start();
  } catch (error) {
    console.info({ error });
  }
};
