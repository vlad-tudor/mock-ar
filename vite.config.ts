import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import dotenv from "dotenv";

const loggerUrl = dotenv.config()?.parsed?.VITE_LOG_SERVER || undefined;
export default defineConfig({
  plugins: [mkcert()],

  // server: {
  //   proxy: {
  //     "/api/log": {
  //       target: loggerUrl,
  //       changeOrigin: true,
  //       secure: true,
  //     },
  //   },
  // },
});
