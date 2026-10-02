/**
 * Load `src/config/seo.ts` from Node.
 *
 * The copy lives in TypeScript so the app, the tests and the generators read
 * one module, but these scripts are plain ESM. Rather than duplicate the copy
 * (which is exactly the drift this repository keeps failing builds over),
 * bundle the module with esbuild — already a Vite dependency — and import the
 * emitted file. React and lucide-react stay external: `seo.ts` pulls in the
 * navigation for SECTION_INDEX, and the navigation pulls in icons.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BUNDLE = join(ROOT, 'node_modules', '.tmp', 'gpc-seo-bundle.mjs');

export { ROOT };

export async function loadSeo() {
  buildSync({
    entryPoints: [join(ROOT, 'src', 'config', 'seo.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
    alias: { '@': join(ROOT, 'src') },
    outfile: BUNDLE,
    logLevel: 'silent'
  });

  // A unique query keeps repeated loads in one process from returning a cached
  // module, so a script can be re-run after an edit without a restart.
  return import(`${pathToFileURL(BUNDLE).href}?v=${Date.now()}`);
}
