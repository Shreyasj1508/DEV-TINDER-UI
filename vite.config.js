import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Force Vite to use port 5173 only, fail if port is busy
    host: true, // Allow access from network
    open: true, // Auto-open browser
  },
});