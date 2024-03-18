/**
 * Creates a logger that logs key-value pairs to an HTML element.
 * @param element - The HTML element to log to.
 * @returns An object with `add` and `remove` methods.
 */
export const logToElement = (element: HTMLElement) => ({
  /**
   * Adds a key-value pair to the log.
   * @param obj - The object containing the key-value pair.
   */
  add: (obj: Record<string, string | number>) => {
    element.innerHTML = Object.entries(obj)
      .map(([key, value]) => `<span>${key}: ${value}</span>`)
      .join("");
  },
  /**
   * Removes all log entries.
   */
  remove: () => {
    element.innerHTML = "";
  },
});

export const bearingWrap = (bearing: number) => {
  return bearing < 0 ? 360 + bearing : bearing;
};

export const bearingOffset = (bearingOne: number, bearingTwo: number) => {
  const offset = bearingWrap(bearingTwo) - bearingWrap(bearingOne);
  return offset < 0 ? 360 + offset : offset;
};
