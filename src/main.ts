// import { overrideConsoleInfo } from "./logger/logger";
import { LOG_SERVER_URL, connectToLogger } from "./logger/logger";
import { GyroProvider } from "./providers/GyroProvider";
import { attachPermissionsGetter } from "./providers/permissions";
import { startThreeApp } from "./three/startThreeApp";
import { bearingOffset, logToElement } from "./utils";

async function hookupLogs(url: string) {
  await connectToLogger(url);

  const logLink = document.getElementById("allow-logs");
  const logs = document.getElementById("logs");

  if (!logLink || !logs) return;

  const { add: addToUiLog } = logToElement(logs);
  return { addToUiLog };
}

/**
 * Main entry point. Start your adventure from here!
 */
async function main(dev = false) {
  const startButton = document.getElementById("start-button");
  const threeContainer = document.getElementById("threejs-container");
  const logsContainer = document.getElementById("logs");

  // <MOVE OUT>
  const logLink = document.getElementById("allow-logs");
  logLink!.addEventListener("click", (e) => {
    e.preventDefault();
    const redirect = encodeURIComponent(window.location.href);
    const logUrl = `${LOG_SERVER_URL}/?home=${redirect}`;
    window.open(logUrl)?.focus();
  });
  // </MOVE OUT>

  const cannotRun =
    !threeContainer ||
    !startButton ||
    !logsContainer ||
    (!dev && !(await attachPermissionsGetter(startButton)));

  const logger = await hookupLogs(LOG_SERVER_URL);

  if (cannotRun) return;

  GyroProvider.start();
  startThreeApp(threeContainer);

  // logging

  if (logger) {
    const { addToUiLog } = logger;
    const log = () => {
      const loggingPayload = {
        compass: GyroProvider.location.compass,
        alpha: GyroProvider.rawValues.alpha,
        bearingOffset: bearingOffset(
          -GyroProvider.location.compass + 360,
          GyroProvider.rawValues.alpha
        ),
      };
      addToUiLog(loggingPayload);
      console.info(loggingPayload);
    };
    GyroProvider.addCallback(log);
  }
}

main(false);
