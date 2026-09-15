import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
      },
    },
  },
});
