import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  ArrowHelper,
  Vector3,
  MathUtils,
  PlaneGeometry,
  DoubleSide,
} from "three";
import { XYZ } from "../types";

/**
 * @param { XYZ } position cube position
 * @returns { Mesh } a cube mesh
 */
export const createCube = ([x, y, z]: XYZ): Mesh => {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);

  cube.position.set(x, y, z);

  return cube;
};

/**
 * Generates a flat grid of cubes
 * @param sideLength side length of grid
 * @param height height above the ground
 * @param spacing spacing between cubes
 * @returns
 */
export const generateCubesGrid = (sideLength: number, height: number, spacing: number): Mesh[] => {
  const cubes = [];
  const start = (-(sideLength - 1) * spacing) / 2; // Calculate start position to center grid at origin

  for (let i = 0; i < sideLength; i++) {
    // Rows
    for (let j = 0; j < sideLength; j++) {
      // Columns
      const x = start + j * spacing; // Calculate x position
      const y = start + i * spacing; // Calculate y position

      const cube = createCube([x, y, height]);
      cubes.push(cube);
    }
  }

  return cubes;
};

/**
 * Generates a plane
 * @param position position of the plane
 * @param size size of the plane
 * @returns
 */
export const createPlane = ([x, y, z]: XYZ, size = 10) => {
  const geometry = new PlaneGeometry(size, size);
  const material = new MeshStandardMaterial({ color: 0xffffff, side: DoubleSide });
  const plane = new Mesh(geometry, material);
  plane.position.set(x, y, z);
  return plane;
};

/**
 * Generates an arrow
 *
 * @param planeOrientation rotation with respect to the origin.
 * @param color hex color of the arrow
 * @returns
 */
export const generateArrow = (
  planeOrientation = 0,
  colour: number = 0x00ff00,
  scale: number = 1
) => {
  const direction = new Vector3(1, 0, 0); // Direction of the arrow
  const origin = new Vector3(0, 0, 0); // Starting point of the arrow
  const length = 2; // Length of the arrow
  const arrow = new ArrowHelper(direction, origin, length * scale, colour, 2 * scale, 1 * scale);

  // point the arrow in a different direction based on an offset value in degrees

  arrow.rotation.z = MathUtils.degToRad(planeOrientation);
  return arrow;
};

/**
 * Generates a compass-looking thing
 * @returns
 */
export const generateCompass = (planeOrientation = 0, scale: number = 1) => {
  const red = 0xff0000;
  const gray = 0x808080;
  const compassGroup = new Group();
  const north = generateArrow(0, red, scale);
  const east = generateArrow(90, gray, scale);
  const south = generateArrow(180, gray, scale);
  const west = generateArrow(270, gray, scale);
  compassGroup.add(north, east, south, west);

  compassGroup.rotation.z = MathUtils.degToRad(planeOrientation);
  return compassGroup;
};
