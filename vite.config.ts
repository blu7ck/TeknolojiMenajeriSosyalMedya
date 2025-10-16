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
        manualChunks: (id) => {
          // React vendor chunk (smaller)
          if (id.includes('react') && !id.includes('react-three')) {
            return 'react-vendor'
          }
          // Three.js vendor chunk (separate heavy chunk)
          if (id.includes('three') || id.includes('@react-three') || id.includes('three-mesh-bvh')) {
            return 'three-vendor'
          }
          // UI vendor chunk
          if (id.includes('lucide-react') || id.includes('framer-motion')) {
            return 'ui-vendor'
          }
          // Supabase vendor chunk
          if (id.includes('@supabase')) {
            return 'supabase-vendor'
          }
          // Markdown vendor chunk
          if (id.includes('react-markdown') || id.includes('remark')) {
            return 'markdown-vendor'
          }
          // Router chunk (separate)
          if (id.includes('react-router')) {
            return 'router-vendor'
          }
          // Admin components (heavy - only load when needed)
          if (id.includes('/admin/') || id.includes('/components/admin')) {
            return 'admin-chunk'
          }
          // Blog components
          if (id.includes('/blog/') || id.includes('/components/blog')) {
            return 'blog-chunk'
          }
          // Gallery component (heavy 3D)
          if (id.includes('GalleryPage') || id.includes('InfiniteGallery')) {
            return 'gallery-chunk'
          }
          // Pages chunk (smaller)
          if (id.includes('/pages/') && !id.includes('HomePage')) {
            return 'pages-chunk'
          }
          // HomePage separate (includes gallery)
          if (id.includes('HomePage')) {
            return 'home-chunk'
          }
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
