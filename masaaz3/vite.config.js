import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-html-panels',
      closeBundle() {
        // admin.html və owner.html-i dist/ qovluğuna kopyala
        try {
          copyFileSync(
            resolve(__dirname, 'admin.html'),
            resolve(__dirname, 'dist/admin.html')
          )
          console.log('✓ admin.html → dist/admin.html')
        } catch(e) {
          console.warn('admin.html tapılmadı:', e.message)
        }
        try {
          copyFileSync(
            resolve(__dirname, 'owner.html'),
            resolve(__dirname, 'dist/owner.html')
          )
          console.log('✓ owner.html → dist/owner.html')
        } catch(e) {
          console.warn('owner.html tapılmadı:', e.message)
        }
      }
    }
  ],
})
