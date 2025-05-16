// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

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
      exclude: ['@moonforge/tokens'],
    },
  },
});
