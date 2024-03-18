import { LoggerApiRoutes, postOptions } from "./consts";

// interfaces with the latest https://github.com/vlad-tudor/logging-server
// TODO: expand to hold some interesting statistics maybe?
export class ServerLogger {
  private url: string;
  private UID?: string;
  private hasError?: boolean;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Get a UID from the server
   */
  private async getUID(): Promise<string | undefined> {
    try {
      const UID = await fetch(`${this.url}${LoggerApiRoutes.getUID}`, postOptions)
        .then((r) => r.json())
        .then(({ UID }) => UID);

      if (!UID || typeof UID !== "string" || (typeof UID == "string" && !UID.length)) {
        this.hasError = true;
        return undefined;
      }

      this.hasError = false;
      return UID;
    } catch (e) {
      console.error(e);
      this.hasError = true;
      return undefined;
    }
  }

  /**
   * Connect to the logger server
   */
  public async connect(): Promise<void> {
    this.UID = await this.getUID();
    if (this.UID) {
      this.hasError = false;
    }
  }

  /**
   * Post a log to the server
   */
  public async postLog(dataToLog: Record<string, any> | string): Promise<Response | undefined> {
    if (!this.UID) {
      return;
    }
    const log = typeof dataToLog === "string" ? { log: dataToLog } : dataToLog;
    try {
      const body = JSON.stringify({ log, UID: this.UID });
      const response = await fetch(`${this.url}${LoggerApiRoutes.postLog}`, {
        ...postOptions,
        body,
      });
      return response;
    } catch (e) {
      this.hasError = true;
    }
  }

  /**
   * Check if the logger is connected
   */
  public get connected() {
    return !this.hasError && !!this.UID;
  }
}
