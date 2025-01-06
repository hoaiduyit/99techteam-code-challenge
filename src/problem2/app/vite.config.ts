import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// @ts-ignore ignore type
import eslint from "vite-plugin-eslint";
import tsconfigPaths from "vite-tsconfig-paths";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), tsconfigPaths()],
  define: {
    "process.env": {},
  },
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src"),
    },
  },
});
