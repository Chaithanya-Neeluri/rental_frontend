import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config with React and sensible defaults
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

