export const LOG_SERVER_URL = import.meta.env.VITE_LOG_SERVER_URL;

export const postOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export const LoggerApiRoutes = {
  getUID: "/api/uid",
  postLog: "/api/log",
};
