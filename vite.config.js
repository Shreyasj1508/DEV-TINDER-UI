import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vitejs.dev/config/
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  define: {
    'process.env': {
      NODE_DEBUG: false,
    },
    global: {},
  },
  server: {
    port: 5173,
    strictPort: true, // Force Vite to use port 5173 only, fail if port is busy
    host: true, // Allow access from network
    open: true, // Auto-open browser
  },
});