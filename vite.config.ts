import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { config } from "dotenv";

const { VITE_LOG_HOST } = config().parsed || {};
export default defineConfig({
  // plugins: [mkcert()], // for SSL
  server: VITE_LOG_HOST
    ? {
        hmr: {
          host: VITE_LOG_HOST,
        },
      }
    : {},
});
