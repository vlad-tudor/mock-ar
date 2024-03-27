import { SensorsProvider } from "../providers/SensorsProvider";
import { createCube, generateCompass } from "./utils/objectCreators";
import { orientationToQuaternion } from "./utils/deviceOrientationUtils";

import { ThreeManager } from "./ThreeManager";
import { MathUtils, Object3D } from "three";

import { AircraftState, getLondonPlanes } from "../api/OpenskyNetwork";
import { convertGpsToThreeJsCoordinates } from "./utils/locations";
import { GpsLocation } from "./types";

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
  const threeManager = new ThreeManager(threeContainer, threeOverlayContainer);
  threeManager.setCameraOptions({
    cameraPosition: [0, 0, 10],
  });

  // // OBJECTS
  const compass = generateCompass(0, 1);
  compass.position.set(0, 0, -10);
  // const cubes = generateCubesGrid(20, 0, 3);
  const cubes: Object3D[] = [];

  const currentLocation: GpsLocation = {
    longitude: SensorsProvider.values.location.coords.longitude,
    latitude: SensorsProvider.values.location.coords.latitude,
    altitude: SensorsProvider.values.location.coords.altitude || 0,
  };

  getLondonPlanes().then((planes) => {
    const logs: any = {};
    planes.forEach((plane, index) => {
      const [longitude, latitude, altitude] = [plane[5], plane[6], plane[13]];
      if (longitude && latitude && altitude) {
        const objectLocation: GpsLocation = { longitude, latitude, altitude };
        const coords = convertGpsToThreeJsCoordinates(currentLocation, objectLocation);
        logs[`plane${index}`] = { longitude, latitude, altitude };
        const cube = createCube(coords);
        cubes.push(cube);
      }
    });
    logs["currentLocation"] = currentLocation;
    console.log(logs);
  });
  const objects = [
    // add things in order here
    compass,
    ...cubes,
  ];

  threeManager.sceneAdd(...objects);

  const render = () => {
    const { orientation } = SensorsProvider.values;
    const { alpha } = SensorsProvider.offset;

    threeManager.setCameraQuaternion(orientationToQuaternion(orientation));
    threeManager.updateOverlayForObjects(objects, MathUtils.degToRad(alpha));
  };

  threeManager.addAnimationCallback(render);
  threeManager.startAnimation();
};
