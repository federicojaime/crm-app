import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/crm/', // Esto hará que la aplicación se sirva desde /crm/
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});