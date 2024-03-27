import { Camera, Sprite, Vector3 } from "three";

export function scaleSpritesForConsistentSize(sprites: Sprite[], camera: Camera) {
  const baseSize = 0.1; // Base size factor for scaling, adjust based on your needs
  const viewSize = 1; // Adjust this value to control the apparent size of the sprite on the screen

  sprites.forEach((sprite) => {
    const distance = sprite.position.distanceTo(camera.position); // Calculate distance from the camera
    // Adjust the scaleFactor calculation to maintain a more consistent screen size
    const scaleFactor = (distance / viewSize) * baseSize;
    // const scaleFactor = 20;
    console.info({ scaleFactor });
    sprite.scale.set(scaleFactor, scaleFactor, 1); // Apply the scale
  });
}
