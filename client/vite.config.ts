import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: '../API/wwwroot', // output directory for the build files (client side static assets to be served to the browser)
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true
  },
  server: {
    port: 3000
  },
  plugins: [react(), mkcert()],
})
