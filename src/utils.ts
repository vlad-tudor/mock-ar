// Overkill
export const logToElement = (element: HTMLElement) => {
  return {
    add: (obj: Record<string, string | number>) => {
      element.innerHTML = Object.entries(obj)
        .map(([key, value]) => `<span>${key}: ${value}</span>`)
        .join("");
    },
    remove: () => {
      element.innerHTML = "";
    },
  };
};
