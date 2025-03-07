import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  theme: {
    fontFamily: {
      body: ['Josefin Sans'],
      special: ["Roboto"],
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
