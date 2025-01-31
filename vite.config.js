import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '~': '/app', // This adds the '~' alias pointing to your app folder.
      // If you want to add an alias for the lib folder, you can do it like this:
      lib: '/lib', // Add an alias for the lib folder if needed
    },
  },
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://wolfshoppen.myshopify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix from the request
        secure: false, // Optional: disable SSL verification if needed
      },
    },
  },
  ssr: {
    optimizeDeps: {
      include: [],
    },
  }, 
  assetsInclude: ['**/*.webp'],
});
