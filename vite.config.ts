import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins: PluginOption[] = [react(), tailwindcss()];

  // Optional local tooling (element tagging for hosted editors). Opt-in only,
  // never required for a production build. See docs/DEPLOYMENT.md.
  if (process.env.GPC_SOURCE_TAGS === '1') {
    try {
      // @ts-expect-error — untracked, machine-local plugin
      const m = await import('./.vite-source-tags.js');
      plugins.push(m.sourceTags());
    } catch {
      console.warn('[gpc] GPC_SOURCE_TAGS=1 but .vite-source-tags.js was not found; continuing without it.');
    }
  }

  return {
    plugins,
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    },
    // Only VITE_* variables are exposed to client code. Never put secrets in them.
    envPrefix: ['VITE_'],
    build: {
      target: 'es2022',
      sourcemap: false,
      // Hashed bundles go to /static so /assets stays free for media in public/assets.
      assetsDir: 'static',
      // The archive's text corpus is one intentionally large, cacheable chunk.
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) return 'icons';
              if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id))
                return 'react';
              return undefined;
            }
            if (id.includes('/src/content/')) return 'content';
            return undefined;
          }
        }
      }
    },
    // Bind to all interfaces so container / cloud previews work.
    server: { host: '0.0.0.0', allowedHosts: true as const },
    preview: { host: '0.0.0.0', allowedHosts: true as const }
  };
});
