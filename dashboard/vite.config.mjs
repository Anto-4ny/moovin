import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/dashboard/' : '/',
    plugins: [react(), jsconfigPaths()],
    build: {
      outDir: 'dist' // Make sure Vercel finds this after build
    },
    server: {
      port: 5173,
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


