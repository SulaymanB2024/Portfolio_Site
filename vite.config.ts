import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'inline-local-font-declarations',
      transformIndexHtml(html) {
        const css = readFileSync(new URL('./public/fonts/fonts.css', import.meta.url), 'utf8');
        return html.replace('<link id="editorial-fonts" rel="stylesheet" href="/fonts/fonts.css" />', `<style data-local-fonts="true">${css}</style>`);
      },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            motion: ['motion/react'],
            lenis: ['lenis']
          }
        }
      }
    }
  };
});
