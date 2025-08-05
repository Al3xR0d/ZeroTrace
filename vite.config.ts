import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ['antd'],
  },
  server: {
    // cors: true,
    proxy: {
      '/api': {
        target: 'http://10.67.0.89:8888', // адрес твоего бэка в облаке
        changeOrigin: true, // меняет Host на target
        secure: false, // если бэк по HTTP
      },
    },
  },
});
