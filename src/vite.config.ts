import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// ─── Custom plugin: handles figma:asset/... virtual imports ──────────────────
// Figma Make exports components with figma:asset imports. On Netlify, these
// don't exist as real files, so we return a transparent 1×1 PNG data-URI.
// All real logos/images now use ToodiesLogoSVG or ImageWithFallback instead.
function figmaAssetPlugin() {
  return {
    name: 'figma-asset-plugin',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        return id;
      }
    },
    load(id: string) {
      if (id.startsWith('figma:asset/')) {
        // Transparent 1×1 PNG – safe fallback so no broken-image icons appear
        return `export default "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="`;
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ① Tailwind CSS v4 — must come before react() plugin
    tailwindcss(),
    // ② React JSX transform
    react(),
    // ③ figma:asset virtual module handler
    figmaAssetPlugin(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),

      // ─── Version-pinned specifiers → installed package names ──────────────
      // Figma Make exports components with version-pinned import specifiers
      // (e.g. "sonner@2.0.3"). Vite/Rollup can't resolve those as-is, so we
      // map every versioned specifier to the plain package name that IS installed.
      // ─────────────────────────────────────────────────────────────────────────

      // Core UI libraries
      'sonner@2.0.3': 'sonner',
      'react-hook-form@7.55.0': 'react-hook-form',
      'vaul@1.1.2': 'vaul',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      'react-day-picker@8.10.1': 'react-day-picker',
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'recharts@2.15.2': 'recharts',
      'cmdk@1.1.1': 'cmdk',
      'input-otp@1.4.2': 'input-otp',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',

      // Radix UI primitives (versioned specifiers)
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
    },
  },

  build: {
    // !! Must match netlify.toml publish directory !!
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        // Let Rollup decide automatic chunking – avoids oversized bundles
        manualChunks: undefined,
      },
      onwarn(warning, warn) {
        // Silence harmless warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 3000,
  },

  server: {
    port: 5173,
    host: true,
  },

  preview: {
    port: 4173,
    host: true,
  },

  envPrefix: 'VITE_',

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'sonner',
      'react-hook-form',
    ],
  },

  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
