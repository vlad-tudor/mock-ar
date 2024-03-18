/**
 * Logger that logs key-value pairs to an HTML element.
 */
export class ElementLogger {
  private element: HTMLElement;

  /**
   * Creates an instance of ElementLogger.
   * @param element - The HTML element to log to.
   */
  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Adds a key-value pair to the log.
   * @param obj - The object containing the key-value pair.
   */
  add(obj: Record<string, string | number> | string) {
    if (typeof obj === "string") {
      this.element.innerHTML += `<span>${obj}</span>`;
    } else {
      const logs = Object.entries(obj)
        .map(([key, value]) => `<span>${key}: ${value}</span>`)
        .join("");

      this.element.innerHTML = logs;
    }
  }

  /**
   * Removes all log entries.
   */
  clear() {
    this.element.innerHTML = "";
  }
}
