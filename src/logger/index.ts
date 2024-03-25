import { ElementLogger } from "./ElementLogger";
import { ServerLogger } from "./ServerLogger";

export type LoggingParams = {
  url: string;
  echo: boolean; // whether to log to the console too
  logsContainer: HTMLElement;
};

/**
 * WARNING: Side effects!
 * Sets up logging for the app
 * Changes the button to indicate whether logs should be allowed
 * overrides console.info
 */
export async function setupLogs({ url, logsContainer, echo }: LoggingParams) {
  if (!logsContainer) {
    return;
  }

  const logger = new ServerLogger(url);
  const logElement = new ElementLogger(logsContainer);
  await logger.connect();

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
