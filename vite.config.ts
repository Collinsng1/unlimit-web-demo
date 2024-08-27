import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: "/Users/collinsng/Unlimit/localhost_https_cert/localhost-key.pem",
      cert: "/Users/collinsng/Unlimit/localhost_https_cert/localhost.pem"
    },
    host: 'localhost'
  }
})
