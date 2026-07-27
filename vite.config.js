import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Bundles chart files safely together
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'charts';
          
          // Bundles animations safely together
          if (id.includes('framer-motion')) return 'motion';
          
          // Simplified checking strings to avoid path slash style mismatches across operating systems
          if (
            id.includes('react') || 
            id.includes('react-dom') || 
            id.includes('react-router-dom') || 
            id.includes('axios')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
})
