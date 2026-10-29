import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ Ithu romba mukkiyam (Relative path ku)
  build: {
    rollupOptions: {
      output: {
        // ✅ Hash names remove panni static names kudukka
        entryFileNames: `assets/index.js`,
        chunkFileNames: `assets/index.js`,
        assetFileNames: `assets/index.[ext]`
      }
    }
  }
})