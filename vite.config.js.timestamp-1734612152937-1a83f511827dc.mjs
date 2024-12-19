// vite.config.js
import { defineConfig } from "file:///home/vishnu/hydrogen/curry-wolf-hydrogen/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///home/vishnu/hydrogen/curry-wolf-hydrogen/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///home/vishnu/hydrogen/curry-wolf-hydrogen/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import { vitePlugin as remix } from "file:///home/vishnu/hydrogen/curry-wolf-hydrogen/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///home/vishnu/hydrogen/curry-wolf-hydrogen/node_modules/vite-tsconfig-paths/dist/index.mjs";
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
  },
  assetsInclude: ["**/*.webp"]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS92aXNobnUvaHlkcm9nZW4vY3Vycnktd29sZi1oeWRyb2dlblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvdmlzaG51L2h5ZHJvZ2VuL2N1cnJ5LXdvbGYtaHlkcm9nZW4vdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvdmlzaG51L2h5ZHJvZ2VuL2N1cnJ5LXdvbGYtaHlkcm9nZW4vdml0ZS5jb25maWcuanNcIjtpbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSc7XG5pbXBvcnQge2h5ZHJvZ2VufSBmcm9tICdAc2hvcGlmeS9oeWRyb2dlbi92aXRlJztcbmltcG9ydCB7b3h5Z2VufSBmcm9tICdAc2hvcGlmeS9taW5pLW94eWdlbi92aXRlJztcbmltcG9ydCB7dml0ZVBsdWdpbiBhcyByZW1peH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBoeWRyb2dlbigpLFxuICAgIG94eWdlbigpLFxuICAgIHJlbWl4KHtcbiAgICAgIHByZXNldHM6IFtoeWRyb2dlbi5wcmVzZXQoKV0sXG4gICAgICBmdXR1cmU6IHtcbiAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG4gICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxuICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34nOiAnL2FwcCcsIC8vIFRoaXMgYWRkcyB0aGUgJ34nIGFsaWFzIHBvaW50aW5nIHRvIHlvdXIgYXBwIGZvbGRlci5cbiAgICAgIC8vIElmIHlvdSB3YW50IHRvIGFkZCBhbiBhbGlhcyBmb3IgdGhlIGxpYiBmb2xkZXIsIHlvdSBjYW4gZG8gaXQgbGlrZSB0aGlzOlxuICAgICAgbGliOiAnL2xpYicsIC8vIEFkZCBhbiBhbGlhcyBmb3IgdGhlIGxpYiBmb2xkZXIgaWYgbmVlZGVkXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyBBbGxvdyBhIHN0cmljdCBDb250ZW50LVNlY3VyaXR5LVBvbGljeVxuICAgIC8vIHdpdGhvdXQgaW5saW5pbmcgYXNzZXRzIGFzIGJhc2U2NDpcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMCxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3dvbGZzaG9wcGVuLm15c2hvcGlmeS5jb20nLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksIC8vIFJlbW92ZSAnL2FwaScgcHJlZml4IGZyb20gdGhlIHJlcXVlc3RcbiAgICAgICAgc2VjdXJlOiBmYWxzZSwgLy8gT3B0aW9uYWw6IGRpc2FibGUgU1NMIHZlcmlmaWNhdGlvbiBpZiBuZWVkZWRcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgc3NyOiB7XG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbXSxcbiAgICB9LFxuICB9LCBcbiAgYXNzZXRzSW5jbHVkZTogWycqKi8qLndlYnAnXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UyxTQUFRLG9CQUFtQjtBQUN4VSxTQUFRLGdCQUFlO0FBQ3ZCLFNBQVEsY0FBYTtBQUNyQixTQUFRLGNBQWMsYUFBWTtBQUNsQyxPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixTQUFTLENBQUMsU0FBUyxPQUFPLENBQUM7QUFBQSxNQUMzQixRQUFRO0FBQUEsUUFDTixtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxNQUN2QjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUE7QUFBQTtBQUFBLE1BRUwsS0FBSztBQUFBO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBO0FBQUEsSUFHTCxtQkFBbUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBO0FBQUEsUUFDNUMsUUFBUTtBQUFBO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUM7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBZSxDQUFDLFdBQVc7QUFDN0IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
