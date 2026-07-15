import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    allowedHosts: ['johnnytao.com.cn']
  },
  build: {
    target: 'es2020'
  }
});
