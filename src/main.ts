import { createAmbientLight, initialiseScene } from "./three/sceneUtils";
import { createCube } from "./three/objectUtils";

function start() {
  const threeContainer = document.getElementById("threejs-container");
  if (!threeContainer) return;

  const [addLight] = createAmbientLight();
  const { scene, animationManager } = initialiseScene(threeContainer, {
    cameraPosition: [0, 0, 5],
    cameraRotation: [0, 0, 0],
  });

  const cube = createCube([0, 0, -3]);
  scene.add(cube);
  addLight(scene);

  const animateCube = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  animationManager.addCallback(animateCube);
  animationManager.start();
}

start();
