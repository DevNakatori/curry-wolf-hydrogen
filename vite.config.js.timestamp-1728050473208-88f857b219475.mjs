// vite.config.js
import { defineConfig } from "file:///home/vishnu/Desktop/Currywolf%20Sanity/curry-wolf-hydrogen/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///home/vishnu/Desktop/Currywolf%20Sanity/curry-wolf-hydrogen/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///home/vishnu/Desktop/Currywolf%20Sanity/curry-wolf-hydrogen/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import { vitePlugin as remix } from "file:///home/vishnu/Desktop/Currywolf%20Sanity/curry-wolf-hydrogen/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///home/vishnu/Desktop/Currywolf%20Sanity/curry-wolf-hydrogen/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    }),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      "~": "/app",
      // This adds the '~' alias pointing to your app folder.
      // If you want to add an alias for the lib folder, you can do it like this:
      lib: "/lib"
      // Add an alias for the lib folder if needed
    }
  },
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0
  },
  server: {
    proxy: {
      "/api": {
        target: "https://wolfshoppen.myshopify.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // Remove '/api' prefix from the request
        secure: false
        // Optional: disable SSL verification if needed
      }
    }
  },
  ssr: {
    optimizeDeps: {
      include: []
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS92aXNobnUvRGVza3RvcC9DdXJyeXdvbGYgU2FuaXR5L2N1cnJ5LXdvbGYtaHlkcm9nZW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Zpc2hudS9EZXNrdG9wL0N1cnJ5d29sZiBTYW5pdHkvY3Vycnktd29sZi1oeWRyb2dlbi92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS92aXNobnUvRGVza3RvcC9DdXJyeXdvbGYlMjBTYW5pdHkvY3Vycnktd29sZi1oeWRyb2dlbi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7ZGVmaW5lQ29uZmlnfSBmcm9tICd2aXRlJztcbmltcG9ydCB7aHlkcm9nZW59IGZyb20gJ0BzaG9waWZ5L2h5ZHJvZ2VuL3ZpdGUnO1xuaW1wb3J0IHtveHlnZW59IGZyb20gJ0BzaG9waWZ5L21pbmktb3h5Z2VuL3ZpdGUnO1xuaW1wb3J0IHt2aXRlUGx1Z2luIGFzIHJlbWl4fSBmcm9tICdAcmVtaXgtcnVuL2Rldic7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIGh5ZHJvZ2VuKCksXG4gICAgb3h5Z2VuKCksXG4gICAgcmVtaXgoe1xuICAgICAgcHJlc2V0czogW2h5ZHJvZ2VuLnByZXNldCgpXSxcbiAgICAgIGZ1dHVyZToge1xuICAgICAgICB2M19mZXRjaGVyUGVyc2lzdDogdHJ1ZSxcbiAgICAgICAgdjNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXG4gICAgICAgIHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnfic6ICcvYXBwJywgLy8gVGhpcyBhZGRzIHRoZSAnficgYWxpYXMgcG9pbnRpbmcgdG8geW91ciBhcHAgZm9sZGVyLlxuICAgICAgLy8gSWYgeW91IHdhbnQgdG8gYWRkIGFuIGFsaWFzIGZvciB0aGUgbGliIGZvbGRlciwgeW91IGNhbiBkbyBpdCBsaWtlIHRoaXM6XG4gICAgICBsaWI6ICcvbGliJywgLy8gQWRkIGFuIGFsaWFzIGZvciB0aGUgbGliIGZvbGRlciBpZiBuZWVkZWRcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIEFsbG93IGEgc3RyaWN0IENvbnRlbnQtU2VjdXJpdHktUG9saWN5XG4gICAgLy8gd2l0aG91dCBpbmxpbmluZyBhc3NldHMgYXMgYmFzZTY0OlxuICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vd29sZnNob3BwZW4ubXlzaG9waWZ5LmNvbScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSwgLy8gUmVtb3ZlICcvYXBpJyBwcmVmaXggZnJvbSB0aGUgcmVxdWVzdFxuICAgICAgICBzZWN1cmU6IGZhbHNlLCAvLyBPcHRpb25hbDogZGlzYWJsZSBTU0wgdmVyaWZpY2F0aW9uIGlmIG5lZWRlZFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzc3I6IHtcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtdLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1YsU0FBUSxvQkFBbUI7QUFDMVgsU0FBUSxnQkFBZTtBQUN2QixTQUFRLGNBQWE7QUFDckIsU0FBUSxjQUFjLGFBQVk7QUFDbEMsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osU0FBUyxDQUFDLFNBQVMsT0FBTyxDQUFDO0FBQUEsTUFDM0IsUUFBUTtBQUFBLFFBQ04sbUJBQW1CO0FBQUEsUUFDbkIsc0JBQXNCO0FBQUEsUUFDdEIscUJBQXFCO0FBQUEsTUFDdkI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBO0FBQUE7QUFBQSxNQUVMLEtBQUs7QUFBQTtBQUFBLElBQ1A7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQTtBQUFBLElBR0wsbUJBQW1CO0FBQUEsRUFDckI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQTtBQUFBLFFBQzVDLFFBQVE7QUFBQTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
