import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { XYZ } from "./types";

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
