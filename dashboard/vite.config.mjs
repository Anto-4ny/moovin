import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/dashboard/' : '/',
    plugins: [react(), jsconfigPaths()],
    server: {
      port: 5173, // Vite dev port (default)
      open: true
    },
    preview: {
      port: 4173,
      open: true
    },
    define: {
      global: 'window'
    }
  };
});


