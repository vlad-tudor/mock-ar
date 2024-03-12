import { GyroProvider } from "./providers/GyroProvider";
import { attachPermissionsGetter } from "./providers/permissions";
import { startThreeApp } from "./three";
import { logToElement } from "./utils";

/**
 * Main entry point. Start your adventure from here!
 */
async function main() {
  const startButton = document.getElementById("start-button");
  const threeContainer = document.getElementById("threejs-container");
  const logs = document.getElementById("logs");

  if (!threeContainer || !startButton || !logs) return;

  /**
   *  NOTE: COMMENT OUT THIS BLOCK BEFORE COMMITTING
   * -- or comment it to prevent pressing 'start' every time your code changes
   */
  // const hasPermissions = await attachPermissionsGetter(startButton);
  // if (!hasPermissions) {
  //   console.error("App requires permissions to run");
  //   return;
  // }

  // logging shenanigans
  const { add } = logToElement(logs);
  const log = () => add(GyroProvider.rawValues);
  GyroProvider.addCallback(log);

  GyroProvider.start();
  startThreeApp(threeContainer);
}

main();
