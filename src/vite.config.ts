import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Custom plugin to handle figma:asset imports
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
        const assetPath = id.replace('figma:asset/', '');
        return `export default "/placeholder-${assetPath}"`;
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), figmaAssetPlugin()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // Figma Make uses versioned imports (e.g. sonner@2.0.3) which don't
      // exist as real npm package names — map them to the actual package.
      'sonner@2.0.3': 'sonner',
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: undefined
      },
      onwarn(warning, warn) {
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      }
    },
    chunkSizeWarningLimit: 2000
  },
  
  server: {
    port: 5173,
    host: true
  },
  
  preview: {
    port: 4173,
    host: true
  },
  
  envPrefix: 'VITE_',
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'sonner',
    ],
    exclude: []
  },

  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});