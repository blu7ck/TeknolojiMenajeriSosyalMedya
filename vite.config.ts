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
          const normalizedId = id.replace(/\\/g, '/')

          if (normalizedId.includes('node_modules')) {
            if (
              normalizedId.includes('node_modules/react') ||
              normalizedId.includes('node_modules/react-dom') ||
              normalizedId.includes('node_modules/react-router')
            ) {
              return 'react-vendor'
            }

            if (
              normalizedId.includes('node_modules/three') ||
              normalizedId.includes('node_modules/@react-three') ||
              normalizedId.includes('node_modules/three-mesh-bvh')
            ) {
              return 'three-vendor'
            }

            if (
              normalizedId.includes('node_modules/framer-motion') ||
              normalizedId.includes('node_modules/lucide-react') ||
              normalizedId.includes('node_modules/styled-components')
            ) {
              return 'ui-vendor'
            }

            if (normalizedId.includes('node_modules/@supabase')) {
              return 'supabase-vendor'
            }

            if (
              normalizedId.includes('node_modules/react-markdown') ||
              normalizedId.includes('node_modules/remark')
            ) {
              return 'markdown-vendor'
            }
          }

          if (
            normalizedId.includes('src/components/admin') ||
            normalizedId.includes('src/pages/Admin')
          ) {
            return 'admin-chunk'
          }

          if (
            normalizedId.includes('src/components/blog') ||
            normalizedId.includes('src/pages/Blog')
          ) {
            return 'blog-chunk'
          }

          if (
            normalizedId.includes('src/components/InfiniteGallery') ||
            normalizedId.includes('src/pages/GalleryPage')
          ) {
            return 'gallery-chunk'
          }

          if (normalizedId.includes('src/pages/HomePage')) {
            return 'home-chunk'
          }

          if (normalizedId.includes('src/pages/')) {
            return 'pages-chunk'
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
