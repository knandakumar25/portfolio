import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // For deployment
  server: {
    host: true,
    // Allow the Playwright container to reach the dev server by service name
    allowedHosts: ['web-dev'],
    watch: {
      // Bind mounts from Windows/macOS hosts don't emit fs events inside containers
      usePolling: process.env.VITE_USE_POLLING === 'true',
    },
  },
});
