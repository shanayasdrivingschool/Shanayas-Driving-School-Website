import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/",
  build: {
    outDir: "public_html",
    rollupOptions: {
      output: {
        /* Routes are already lazy-loaded, so everything left in the entry chunk is
           shared code that every visitor downloads — including Supabase, which only
           the admin, affiliate and checkout routes actually use. Splitting the large
           vendors out keeps them off the critical path and lets them stay cached
           across deploys, since they change far less often than app code.

           React, the router and react-query stay in one chunk on purpose: they are
           interdependent and initialise together, so separating them buys nothing
           and risks module-ordering bugs. */
        manualChunks: (id) => {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("@supabase")) {
            return "supabase";
          }

          if (id.includes("@stripe")) {
            return "stripe";
          }

          if (id.includes("@radix-ui")) {
            return "radix";
          }

          if (
            /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id) ||
            id.includes("@tanstack")
          ) {
            return "react-vendor";
          }

          return "vendor";
        },
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
