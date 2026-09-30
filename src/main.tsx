import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted fonts (no third-party font CDN: keeps the CSP tight and the
// reader's IP away from Google).
//   Archivo            — the Order's institutional display face (headers, plates)
//   Noto Sans Symbols  — astronomical / planetary glyphs, used as data labels
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-500.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/noto-sans-symbols/400.css';
import '@fontsource/noto-sans-symbols-2/400.css';
import '@/styles/index.css';
import { App } from '@/app/app';

const root = document.getElementById('root');
if (!root) throw new Error('GPC: #root element missing from index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
