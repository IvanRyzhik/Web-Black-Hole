import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.config';

export default defineConfig({
  plugins: [tsconfigPaths(), crx({ manifest })],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
