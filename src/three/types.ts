import { Camera, Scene } from "three";

export type NonNullRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export type XYZ = [x: number, y: number, z: number];
export type CameraOptions = { cameraRotation: XYZ; cameraPosition: XYZ };
export type SceneCamera<T extends Camera> = { camera: T; scene: Scene };

export type EnuCoordinate = [east: number, north: number, up: number];

export type GpsLocation = NonNullRequired<
  Required<Pick<GeolocationPosition["coords"], "latitude" | "longitude" | "altitude">>
>;
