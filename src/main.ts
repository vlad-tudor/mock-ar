// import { overrideConsoleInfo } from "./logger/logger";
import { LOG_URL, overrideConsoleInfo, postLog } from "./logger/logger";
import { GyroProvider } from "./providers/GyroProvider";
import { attachPermissionsGetter } from "./providers/permissions";
import { startThreeApp } from "./three/startThreeApp";
import { logToElement } from "./utils";

overrideConsoleInfo();

/**
 * Main entry point. Start your adventure from here!
 */
async function main() {
  const logLink = document.getElementById("allow-logs");
  const startButton = document.getElementById("start-button");
  const threeContainer = document.getElementById("threejs-container");
  const logs = document.getElementById("logs");

  if (!threeContainer || !startButton || !logs) return;

  if (logLink) {
    // set href to something
    logLink.setAttribute("href", LOG_URL);
  }

  /**
   *  NOTE: COMMENT OUT THIS BLOCK BEFORE COMMITTING
   * -- or comment it to prevent pressing 'start' every time your code changes
   */
  const hasPermissions = await attachPermissionsGetter(startButton);
  if (!hasPermissions) {
    console.error("App requires permissions to run");
    return;
  }

  // logging to an element
  const { add } = logToElement(logs);
  const log = () => {
    add(GyroProvider.rawValues);
  };
  GyroProvider.addCallback(log);

  GyroProvider.start();
  startThreeApp(threeContainer);
}

main();
