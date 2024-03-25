import { UserConfig, defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { config } from "dotenv";

const { VITE_HOST } = config().parsed || {};

const viteConfig: UserConfig = {};

if (!VITE_HOST) {
  viteConfig.plugins = [mkcert()];
} else {
  viteConfig.server = { hmr: { host: VITE_HOST } };
}

export default defineConfig(viteConfig);
