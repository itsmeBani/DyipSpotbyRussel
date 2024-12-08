import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fixReactVirtualized from  "esbuild-plugin-react-virtualized"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps:{
    esbuildOptions:{
      plugins:[fixReactVirtualized]
    }
  },
  server: {
    proxy: {
      '/predict': {
        target: 'https://predictdestination-2z3l.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },

})
