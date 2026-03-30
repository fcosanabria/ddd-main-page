import { defineConfig } from 'vite';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
  resolve: {
    alias: {
      'three': 'three'
    }
  },
  server: {
    host: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
});