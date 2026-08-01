import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/",
  build: {
    /* Deliberately no manualChunks here. A hand-rolled vendor split shipped a
       react-vendor <-> vendor cycle that broke module initialisation and left a
       white screen in production — a catch-all "vendor" bucket inevitably captures
       something React itself depends on. Rollup's automatic chunking already gives
       each dynamic import its own chunk, which is what actually keeps Supabase off
       the critical path; that comes from the dynamic imports in the auth providers,
       ReferralTracker and the lazy AdminRouteGuard, not from splitting vendors. */
    outDir: "public_html",
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
