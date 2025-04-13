import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { tempo } from 'tempo-devtools/dist/vite';

// https://vitejs.dev/config/
export default defineConfig({
  // base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  base: '/tsms-react',
  optimizeDeps: {
    entries: ['src/main.tsx', 'src/tempobook/**/*'],
  },
  plugins: [react(), tempo()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
  },
});
