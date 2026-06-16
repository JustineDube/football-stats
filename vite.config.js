import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        match: resolve(__dirname, "match.html"),
        player: resolve(__dirname, "player.html"),
        team: resolve(__dirname, "team.html")
      }
    }
  },
  server: {
    port: 5173,
    // Proxy NewsAPI calls to avoid CORS in dev
    proxy: {
      "/newsapi": {
        target: "https://newsapi.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/newsapi/, "")
      }
    }
  }
});
