// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  server: {
    host: true,
    port: 3000,
  },
  vite: {
    optimizeDeps: {
      exclude: ['@moonlore/tokens'],
    },
    build: {
      rollupOptions: {
        external: ['node:path', 'node:fs/promises', 'node:url', 'node:crypto']
      }
    },
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@lib': '/src/lib',
      }
    }
  },
});
