import { FetchOptions, LoggerApiRoutes } from "./logConstants";

// interfaces with the latest https://github.com/vlad-tudor/logging-server
// TODO: expand to hold some interesting statistics maybe?
// TODO: Change to work via web sockets
export class ServerLogger {
  private url: string;
  private UID?: string;
  private hasError?: boolean;
  private ws?: WebSocket;
  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to the logger server
   */
  public async connect(): Promise<void> {
    this.UID = await this.getUID();
    if (this.UID) {
      this.connectToSocket(this.UID);
      this.hasError = false;
    }
  }

  /**
   * Get a UID from the server
   */
  private async getUID(): Promise<string | undefined> {
    try {
      const UID = await fetch(`${this.url}${LoggerApiRoutes.getUID}`, FetchOptions.GET)
        .then((r) => r.json())
        .then(({ UID }) => UID);

      if (!UID || typeof UID !== "string" || (typeof UID == "string" && !UID.length)) {
        this.hasError = true;
        return undefined;
      }

      this.hasError = false;
      return UID;
    } catch (e) {
      this.hasError = true;
      return undefined;
    }
  }

  private sendToSocket(data?: Record<string, any> | string) {
    if (!this.ws || !this.UID) return;
    try {
      this.ws.send(JSON.stringify({ UID: this.UID, data }));
    } catch (e) {
      console.error("Socket error,", e);
    }
  }

  private async connectToSocket(UID: string) {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = (event) => {
      this.sendToSocket(); // Sending a message to the server
    };
  }

  /**
   * Post a log to the server
   */
  public async postLog(dataToLog: Record<string, any> | string): Promise<Response | undefined> {
    if (!this.UID) {
      return;
    }
    this.sendToSocket(dataToLog);
  }

  /**
   * Check if the logger is connected
   */
  public get connected() {
    return !this.hasError && !!this.UID;
  }
}
