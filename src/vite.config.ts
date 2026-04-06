import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'figma:asset/d31f1d417f75594ba1ab67a4c64ef32e85ec2234.png': path.resolve(__dirname, './src/assets/d31f1d417f75594ba1ab67a4c64ef32e85ec2234.png'),
      'figma:asset/c561690211cdd59869b2af6c111db0bf09f362da.png': path.resolve(__dirname, './src/assets/c561690211cdd59869b2af6c111db0bf09f362da.png'),
      'figma:asset/404faa741eb4394d917a24330c1566de438eea2b.png': path.resolve(__dirname, './src/assets/404faa741eb4394d917a24330c1566de438eea2b.png'),
      'figma:asset/0384d838979de15e8db05f2eef126aa9e88613fe.png': path.resolve(__dirname, './src/assets/0384d838979de15e8db05f2eef126aa9e88613fe.png'),
      'sonner@2.0.3': 'sonner',
      'react-hook-form@7.55.0': 'react-hook-form',
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/@supabase/') || id.includes('/@jsr/supabase__supabase-js/')) return 'supabase-vendor';
          if (id.includes('/@radix-ui/')) return 'radix-vendor';
          if (id.includes('/lucide-react/')) return 'icons-vendor';
          if (id.includes('/jspdf/') || id.includes('/jszip/')) return 'export-vendor';
        },
      },
      onwarn(warning, warn) {
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },

  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  envPrefix: 'VITE_',

  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js', 'sonner', 'react-hook-form'],
  },

  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
