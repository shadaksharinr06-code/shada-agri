import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/shada-agri/',
  plugins: [react()],
  server: {
    port: 4173,
    host: true
  }
});
