import { setupLogs } from "./logger";
import { LOG_SERVER_URL } from "./logger/consts";
import { SensorsProvider } from "./providers/SensorsProvider";
import { attachPermissionsGetter } from "./providers/permissions";
import { startThreeApp } from "./three/startThreeApp";

// TODO?: move to gyro provider?
const testGyro = () =>
  new Promise((resolve) => setTimeout(() => resolve(SensorsProvider.running), 100));

/**
 * Main entry point. Start your adventure from here!
 */
async function main(dev = false) {
  const startButton = document.getElementById("start-button");
  const threeContainer = document.getElementById("threejs-container");
  const logsContainer = document.getElementById("logs");

  const cannotRun = !threeContainer || !startButton || !logsContainer;
  if (cannotRun) return;

  // requests device permissions if the device isn't running,
  // skips if the device is already running
  SensorsProvider.start();
  const runningGyro = await testGyro();
  if (!(dev && runningGyro)) {
    const permissions = await attachPermissionsGetter(startButton);
    if (!permissions) {
      return;
    }
  }

  // currently the logging_server url is set up to be the same as the app's url
  // but this is because the logging server's port is mapped on the same container as this UI app
  //
  const url = LOG_SERVER_URL;
  await setupLogs({ url, logsContainer, echo: false });
  startThreeApp(threeContainer);
}

main(true);
