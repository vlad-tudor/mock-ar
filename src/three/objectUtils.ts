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
