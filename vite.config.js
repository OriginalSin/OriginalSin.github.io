import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		mkcert(),
		svelte(),
  ],
  server: {
		host: '127.0.0.1',
		port: 8082,
		https: true,
		open: true,
	},

})
