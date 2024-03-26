export const LOG_SERVER_URL = import.meta.env.VITE_LOG_SERVER_URL;

export const FetchOptions = {
  GET: {
    method: "GET",
  },
  POST: {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  },
};

export const LoggerApiRoutes = {
  getUID: "/uid",
  postLog: "/log",
};
