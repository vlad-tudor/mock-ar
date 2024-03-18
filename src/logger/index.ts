import { ElementLogger } from "./ElementLogger";
import { ServerLogger } from "./ServerLogger";
import { LOG_SERVER_URL } from "./consts";

export type LoggingParams = {
  url: string;
  echo: boolean; // whether to log to the console too
  allowLogsButton: HTMLElement;
  logsContainer: HTMLElement;
};

/**
 * WARNING: Side effects!
 * Sets up logging for the app
 * Changes the button to indicate whether logs should be allowed
 * overrides console.info
 */
export async function setupLogs({ url, allowLogsButton, logsContainer, echo }: LoggingParams) {
  console.log({ allowLogsButton, logsContainer });
  if (!allowLogsButton || !logsContainer) {
    return;
  }

  const logger = new ServerLogger(url);
  await logger.connect();

  if (!logger.connected) {
    allowLogsButton.innerHTML = "Allow Logs";
    allowLogsButton!.addEventListener("click", (e) => {
      e.preventDefault();
      const redirect = encodeURIComponent(window.location.href);
      const logUrl = `${LOG_SERVER_URL}/?home=${redirect}`;
      // Redirect to the logging server
      window.location.replace(logUrl);
    });
  } else {
    allowLogsButton.innerHTML = "Logs allowed";
    allowLogsButton.setAttribute("disabled", "true");
  }

  const logElement = new ElementLogger(logsContainer);

  // overriding console.info
  const oldInfo = console.info;
  console.info = (log: Record<string, any> | string) => {
    if (logger.connected) {
      logger.postLog(log);
    }
    logElement.add(log);
    if (echo) {
      oldInfo(log);
    }
  };
}
