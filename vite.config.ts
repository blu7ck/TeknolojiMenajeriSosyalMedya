import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk'ları ayır
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'markdown-vendor': ['react-markdown', 'remark-gfm'],
        },
        // Daha küçük chunk'lar için
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    // Minification optimizasyonu
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Production'da console.log'ları kaldır
        drop_debugger: true,
      },
    },
  },
});
