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
  const allowLogsButton = document.getElementById("allow-logs");
  const logsContainer = document.getElementById("logs");

  const cannotRun = !threeContainer || !startButton || !logsContainer || !allowLogsButton;

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

  await setupLogs({ url: LOG_SERVER_URL, allowLogsButton, logsContainer, echo: false });
  startThreeApp(threeContainer);

  // logging

  const log = () => {
    const loggingPayload = {
      latitude: SensorsProvider.values.location.coords.latitude,
      longitude: SensorsProvider.values.location.coords.longitude,
      heading: SensorsProvider.values.location.coords.heading,
      alpha: SensorsProvider.values.orientation.alpha,
    };
    // console.info(loggingPayload);
  };
  SensorsProvider.addCallback(log);
}

main(true);
