import { writeFileSync } from "fs";
import { networkInterfaces } from "os";

// ensure that ports match.
// only run this script for development.
const LOGGING_SERVER_PORT = 8080;

const ipAddress = Object.values(networkInterfaces())
  .flat()
  .find((iface) => iface?.family === "IPv4" && !iface.internal)?.address;

const envPath = ".env";
const content = `VITE_LOG_SERVER_URL=https://${ipAddress}:${LOGGING_SERVER_PORT}`;

writeFileSync(envPath, content, "utf-8");
