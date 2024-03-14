// const loggerUrl = import.meta.env.VITE_LOG_SERVER;
export const LOG_URL = "https://192.168.0.29:8080";

export const postLog = async (log: any) => {
  const response = await fetch(`${LOG_URL}/api/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ log }),
  });

  if (!response.ok) {
    console.error("Failed to post log", response);
  }

  return response;
};

export const overrideConsoleInfo = () =>
  Object.assign(console, {
    info: (log: any) => {
      postLog(log);
    },
  });
