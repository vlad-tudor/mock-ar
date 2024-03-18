import { setupLogs } from "./logger";
import { LOG_SERVER_URL } from "./logger/consts";
import { GyroProvider } from "./providers/GyroProvider";
import { attachPermissionsGetter } from "./providers/permissions";
import { startThreeApp } from "./three/startThreeApp";
import { bearingOffset } from "./utils";

// TODO?: move to gyro provider?
const testGyro = () =>
  new Promise((resolve) => setTimeout(() => resolve(GyroProvider.running), 100));
/**
 * Main entry point. Start your adventure from here!
 */
async function main(dev = false) {
  const startButton = document.getElementById("start-button");
  const threeContainer = document.getElementById("threejs-container");
  const allowLogsButton = document.getElementById("allow-logs");
  const logsContainer = document.getElementById("logs");

  const cannotRun = !threeContainer || !startButton || !logsContainer || !allowLogsButton;

  if (cannotRun) return;

  // requests device permissions if the device isn't running,
  // skips if the device is already running
  GyroProvider.start();
  const runningGyro = await testGyro();
  if (!(dev && runningGyro)) {
    const permissions = await attachPermissionsGetter(startButton);
    if (!permissions) {
      return;
    }
  }

  await setupLogs({ url: LOG_SERVER_URL, allowLogsButton, logsContainer, echo: false });
  startThreeApp(threeContainer);

  // logging

  const log = () => {
    const loggingPayload = {
      compass: GyroProvider.location.compass,
      // alpha: GyroProvider.rawValues.alpha,
      bearingOffset: bearingOffset(
        -GyroProvider.location.compass + 360,
        GyroProvider.rawValues.alpha
      ),
    };

    console.info(loggingPayload);
  };
  GyroProvider.addCallback(log);
}

main(true);
