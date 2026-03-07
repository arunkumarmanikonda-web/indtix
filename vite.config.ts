import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return { build: { rollupOptions: { input: './src/client.ts' }, emptyOutDir: false } }
  }
  return {
    plugins: [
      build({ entry: 'src/index.ts' }),
      devServer({ adapter: undefined, entry: 'src/index.ts' }),
    ],
  }
})
