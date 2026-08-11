import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Exclude the large extracted folder and zip files from file watching
      ignored: [
        '**/public_html_extracted/**',
        '**/*.zip',
        '**/*.crdownload',
      ],
    },
  },
})
