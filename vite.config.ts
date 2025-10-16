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
          // React vendor chunk
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor'
          }
          // Three.js vendor chunk
          if (id.includes('three') || id.includes('@react-three')) {
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
          // Admin components (heavy)
          if (id.includes('/admin/') || id.includes('/components/admin')) {
            return 'admin-chunk'
          }
          // Blog components
          if (id.includes('/blog/') || id.includes('/components/blog')) {
            return 'blog-chunk'
          }
          // Pages chunk
          if (id.includes('/pages/')) {
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
