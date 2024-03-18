export const LOG_SERVER_URL = import.meta.env.VITE_LOG_SERVER_URL;

const fetchWithJson = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    console.error("Failed to fetch", response);
  }
  return response;
};

/**
 * CAUTION: This function will override the `console.info` method.
 * It will post logs to the server and log them to the console.
 */
export const connectToLogger = async (url: string) => {
  const uidResponse = await fetchWithJson(`${url}/api/uid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      console.error("Failed to get UID", e);
      return undefined;
    });

  const UID = uidResponse?.uid;
  if (!UID) {
    console.error("Failed to get UID");
    return;
  } else {
    console.info("Got UID", UID);
  }

  const postLog = async (log: any, uid?: string) => {
    const response = await fetchWithJson(`${url}/api/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ log, uid }),
    });

    return response;
  };

  const originalInfo = console.info;
  Object.assign(console, {
    info: (log: any) => {
      postLog(log, UID);
      // originalInfo(log);
    },
  });
};
