import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // penting untuk load asset relatif
  plugins: [react()],
  server: {
    host: true,       // atau host: '0.0.0.0' → agar bisa diakses di jaringan lokal
    port: 5173,       // default port, bisa diganti kalau perlu
  },
});