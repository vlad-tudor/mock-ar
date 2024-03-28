import { SensorsProvider } from "../providers/SensorsProvider";
import { createCube, generateCompass, generateCubesGrid } from "./utils/objectCreators";
import { orientationToQuaternion } from "./utils/deviceOrientationUtils";

import { ThreeManager } from "./ThreeManager";
import { MathUtils, Object3D } from "three";

import { AircraftState, getLondonPlanes } from "../api/OpenskyNetwork";
import { convertGpsToThreeJsCoordinates } from "./utils/locations";
import { GpsLocation } from "./types";
import { OverlayManager } from "./OverlayManager";

/**
 * Starts the app
 * Contains setup & render loop
 * @param { HTMLElement} threeContainer - the container for the app
 * @param { HTMLElement} threeOverlayContainer - the container for the overlay
 */
export const startThreeApp = async (
  threeContainer: HTMLElement,
  threeOverlayContainer: HTMLElement
) => {
  const threeManager = new ThreeManager(threeContainer);
  threeManager.setCameraOptions({ cameraPosition: [0, 0, 20] });
  const overlayManager = new OverlayManager(threeOverlayContainer, threeManager.camera);

  // // OBJECTS
  const compass = generateCompass(0, 1);
  compass.position.set(0, 0, 0);

  type Plane = {
    coords: GpsLocation;
    object: Object3D;
  };

  const planesRecord: Record<string, Plane> = {};

  // await getLondonPlanes().then((planes) => {
  //   planes.forEach((plane) => {
  //     const [longitude, latitude, altitude] = [plane[5] || 0, plane[6] || 0, plane[13] || 0];
  //     const coords: GpsLocation = { longitude, latitude, altitude };
  //     const object = createCube([0, 0, 0]);
  //     planesRecord[plane[0]] = { coords, object };
  //   });
  // });

  const planeObjects = Object.values(planesRecord).map((plane) => plane.object);

  const objects = [...planeObjects, compass];
  threeManager.sceneAdd(...objects);

  const render = () => {
    const { orientation } = SensorsProvider.values;
    const { alpha } = SensorsProvider.offset;

    threeManager.setCameraQuaternion(orientationToQuaternion(orientation));

    for (const plane of Object.values(planesRecord)) {
      const [x, y, z] = convertGpsToThreeJsCoordinates(
        SensorsProvider.values.location.coords,
        plane.coords
      );
      plane.object.position.set(x, y, z);
    }

    overlayManager.updateOverlayForObjects(objects, MathUtils.degToRad(alpha));
  };

  threeManager.addAnimationCallback(render);
  threeManager.startAnimation();
};
