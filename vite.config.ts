import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": fileURLToPath(new URL("./assets", import.meta.url)),
    },
  },
})
